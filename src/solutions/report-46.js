const Chart = require("chart-js");

// everything in standard units [m, s, kg etc.
let userSeries =
[
    0.5,0.45,0.4,0.35,0.3
];

let userData = 
[
    14.22,14.3,14.31,14.27,14.25,14.17,14.2,14.2,14.2,14.72,14.22,14.32,
    13.67,13.68,13.53,13.49,13.67,13.6,13.66,13.72,13.74,13.74,13.55,13.57,
    12.95,13.01,12.95,12.94,13.02,13.01,12.89,12.88,13.15,12.83,12.95,12.95,
    12.31,12.17,12.25,12.17,12.17,12.18,12.04,12.03,12.24,12.24,12.11,12.16,
    11.39,11.05,11.78,11.26,11.26,11.25,11.36,11.39,11.26,11.32,11.24,11.31

];

function standardDeviation(xSeries, average) {
    let sum = 0;
    xSeries.forEach((val) => {
        sum += (val - average)**2;
    });
    return Math.sqrt(sum/(xSeries.length-1));
}

function average(xSeries) {
    let sum = 0;
    xSeries.forEach(val => sum += val);
    return sum / xSeries.length;
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}


function firstStep(inData, inSeries) {
    // get input from user

    if (inData.length != 60) {
        console.error("Excpected 60 measurements.");
        return -1;
    }
    if (inSeries.length != 5) {
        console.error("Expected 5 series of measurments");
        return -1;
    }

    let measurments = {};
    
    inSeries.forEach((val) => {measurments[val] = []});

    for (let i = 0; i < 60; i++) {
        measurments[inSeries[Math.floor(i / 12)]].push(Number(inData[i]));
    }
    return measurments;
}

function secondStep() {
    // dL, u(L) [m]
    return [0.001, (0.001 / Math.sqrt(3))];
}

function thirdStep(measurements, inSeries) {
    // discard gross errors - simplified -> only discard two most extreme values
    inSeries.forEach((val) => {
        let measure = measurements[val];
        let max = -1;
        let min = 10000;
        let avg = average(measure);
        for (let tmp in range(2)) {
            for (let j = 0; j < 10; j++) {
                if (measure[j] > max) max = measure[j];
                if (measure[j] < min) min = measure[j];
            }
            if (Math.abs(avg - min) > Math.abs(max - avg)) {
                measure.splice(measure.indexOf(min), 1);
            } else {
                measure.splice(measure.indexOf(max), 1);
            }
        }
    });
    return measurements;
}

function fourthStep(measurements, inSeries) {
    // average time for 10 cycles and 1 cycle
    let periodOfTen = {};
    let periodOfOne = {};
    inSeries.forEach((val) => {
        periodOfTen[val] = average(measurements[val]);
        periodOfOne[val] = periodOfTen[val] / 10;
    });
    return [periodOfTen, periodOfOne];
}

function fifthStep(measurements, inSeries) {
    // u(T) and sigma(T), deltaT
    let stdUnc = {};
    let expUnc = {};
    let stdDev = {};
    let dT = 0.02;

    inSeries.forEach((val) => {
        stdDev[val] = standardDeviation(measurements[val], average(measurements[val]));
        stdUnc[val] = Math.sqrt(stdDev[val]**2 + (dT**2)/3);
        expUnc[val] = stdUnc[val] * 2;
    })

    return {"stdDev": stdDev, "stdUnc":stdUnc, "expUnc":expUnc, "dT": dT};
}

function sixthStep(periods, inSeries, uL, uT) {
    // calculate g u(g) and U(g)
    let g = {};
    let stdUnc = {};
    let expUnc = {};
    inSeries.forEach((val) => {
        g[val] = parseFloat(val) * ((Math.PI*2) / periods[val])**2;
        stdUnc[val] = Math.sqrt( (((16 * (Math.PI ** 4)) / (periods[val])) * (uL**2)) + (((64 * (Math.PI ** 4) * (parseFloat(val)**2)) / (periods[val] ** 6))*(uT[val] ** 2)) );
        expUnc[val] = stdUnc[val] * 2;
    })
    return {"g": g, "stdUnc": stdUnc, "exprUnc": expUnc};
}

function seventhStep() {
    // create table from 5. and 6.
}

function eightStep(gravity, inSeries) {
    let G = 9.8123;
    let constGrav = [];
    let gravityData = [];
    inSeries.forEach((val) => {
        gravityData.push(gravity["g"][val])
        constGrav.push(G);
    });

    new Chart(
        document.getElementById('graph'),
        {
            type: "scatter",
            data: 
            {
                labels: inSeries,
                datasets: 
                [
                    {
                        label: "Wartość g do długości wahadła",
                        data: gravityData,
                    },
                    {
                        lavel: "Stała g odczytana z tablicy",
                        data: constGrav,
                        type: "line"
                    }
                ]
            },
            options:
            {
                scales:
                {
                    y:
                    {
                        suggestedMin: 6.0,
                        suggestedMax: 12.0
                    }

                }
            }
        }
    )
    // graph g to length with errors
}


let measurements = firstStep(userData, userSeries);
let lengthUncertainties = secondStep();
measurements = thirdStep(measurements, userSeries);
let periods = fourthStep(measurements, userSeries);
let periodUncertainties = fifthStep(measurements, userSeries);
let gravityCalculations = sixthStep(periods[1], userSeries, lengthUncertainties[1], periodUncertainties["stdUnc"]);
eightStep(gravityCalculations, userSeries);

export const tokens =
    {
        "2.1. Wstęp teoretyczny": 
        [
            [
                "Streść",
                "Wahadło było wykorzystywane od niepamiętnych czasów. Jego zastosowania opierają się na wykorzystaniu\
                przyciągania grawitacyjnego pomiędzy dwiema masami - masą Ziemi oraz masą wahadła, czyli np. ciężarka\
                zawieszonego na sznurku, za pomocą którego można wyznaczać pion.\
                W starożytności drgania odwróconego wahadła służyły do wykrywania trzęsień Ziemi oraz ich kierunku.1\
                Dzięki badaniom Galileusza nad izochronizmem, przez następne blisko 330 lat zastosowanie wahadła\
                umożliwiło budowę najdokładniejszych zegarów, zwiększając dokładność tych urządzeń z 15 minut do 15\
                sekund na dobę, a nawet lepiej.\
                W przypadku poniższego eksperymentu wahadło zostanie wykorzystane do pomiaru wartości przyspieszenia\
                ziemskiego g, gdyż wartość tego przyspieszenia ma wpływ na długość okresu jego drgań."
            ],
            [
                "Streść",
                "Rozważmy masę punktową m zawieszoną na nierozciągliwej, nieważkiej nici o długości L. Na wahadło\
                wychylone z położenia o kąt działa moment siły ciężkości przeciwnie skierowany w stosunku do wektora\
                przyspieszenia. Korzystając z II Zasady Dynamiki Newtona dla ruchu obrotowego otrzymujemy:\
                𝐼𝜀⃗= 𝑀ሬሬ⃗\
                gdzie 𝐼 = 𝑚𝐿ଶ to moment bezwładności masy m."
            ],
            [
                "Streść",
                "Wartość momentu siły zależy od składowej siły ciężkości\
                prostopadłej do ramienia wahadła:\
                𝑀 = 𝐿𝑚𝑔𝑠𝑖𝑛𝜃\
                Wówczas II Zasada Dynamiki Newtona przyjmuje postać\
                𝐼 ௗమఏ\
                ௗ௧మ = −𝐿𝑚𝑔𝑠𝑖𝑛𝜃 \
                Znak „–„ oznacza, że składowa siły ciężkości\
                przeciwdziała wychylaniu się masy z położenia\
                równowagi."
            ],
            [
                "Streść",
                "Równanie to nie opisuje jednak drgań harmonicznych, bo działająca siła nie jest wprost proporcjonalna do\
                wychylenia z położenia równowagi. Jednak dla małych kątów (<10) sin   i uwzględniając wartość momentu\
                bezwładności równanie (3) przyjmuje postać równani\
                drgań harmonicznych:\
                ௗమఏ\
                ௗ௧మ = − ௚\
                ௅ 𝜃\
                Przyrównując do oscylatora harmonicznego: ௗమ௫\
                ௗ௧మ + 𝜔௢\
                ଶ𝑥 = 0\
                Otrzymujemy wartość częstości kołowej drgań:\
                𝜔௢ = ට௚\
                ௅ \
                Czyli okres drgań wahadła możemy zapisać jako:\
                𝑇 = ଶగ\
                ఠబ\
                = 2𝜋 ∙ ට௅\
                ௚ \
                Z powyższego wzoru można określić wartość przyspieszenia ziemskiego:\
                𝑔 = 𝐿 ቀଶగ் ቁଶ"
            ],
            [
                "Streść",
                "Korzystając z metody różniczki zupełnej wyznaczamy niepewność pomiarową przyspieszenia ziemskiego:\
                uc(g) = ටቀ∂g\
                ∂L ∙ u(L)ቁ2\
                + ቀ∂g\
                ∂T ∙ uc(T)ቁ2\
                Gdzie:\
                డ௚\
                డ௅ = ସగమ்\
                మ \
                డ௚\
                డ் =଼ ௅గ మ்\
                య \
                𝑢(𝐿) = ∆௅\
                √ଷ \
                ∆𝑇 = ∆௧\
                ௡ \
                gdzie n – liczba mierzonych okresów drgań\
                𝑢௖(𝑇) = ට(𝜎் )ଶ + ∆் మ\
                ଷ \
                Podstawiając otrzymujemy:\
                uୡ(g) = ටଵ଺ ర\
                ୘ర ∙ u(L)ଶ + ଺ସ ஠ర ୐మ\
                ୘ల ∙ uୡ(T)ଶ"
            ],
            [
                "Streść",
                "Wyznaczoną wartość g można porównać wielkością tablicową uwzględniając niepewność rozszerzoną Uc(g).\
                Istnieje wiele modeli opisujących zależność g od położenia geograficznego i wysokości nad poziomem morza\
                (n.p.m.). Jedną z częściej stosowanych formuł jest wyrażenie opisane poniższym równaniem:\
                𝑔(𝛼, ℎ) = 9.780318 ∗ (1 + 0.0053024 ∗ 𝑠in[ గఈ\
                ଵ଼଴ ]ଶ − 0.0000058 ∗ sin[గఈ\
                ଽ଴ ]ଶ) − 3.086 ∗ 10ି ଺ ∗ ℎ\
                gdzie:\
                𝛼 - wyraża szerokość geograficzną liczoną w stopniach,\
                h - określa wysokość nad poziomem morza liczoną w metrach.\
                Przyjmując dla Warszawy 𝛼 = 52,25 °𝑁 i h = 116 m n.p.m. otrzymujemy g = 9,8123 ms-2"
            ]
        ],
        "2.2. Opis układu pomiarowego":
        [
            [
                "Streść krótko",
                "Laboratoryjny układ pomiarowy zbudowany jest z podstawy,\
                czyli poziomej płyty, do której przymocowany jest pionowy pręt \
                o przekroju kołowym. Na nim znajduje się pozioma belka z\
                otworem na jej końcu. Przez otwór przechodzi linka z\
                możliwością regulacji jej długości za pomocą śruby. Na końcu\
                linki zaczepiona jest kula.\
                W doświadczeniu pomijamy sprężystość i wagę linki  a także opór\
                powietrza.\
                Układ należy ustawić na wypoziomowanym stole, a przed\
                przystąpieniem do pomiarów upewnić się, że płyta  nie porusza się\
                podczas oscylacji kuli g. Optymalny układ powinien posiadać trzy\
                klocki podpierające płytę a. wówczas uniknie się oscylacji wahadła w\
                kierunku prostopadłym do jego początkowego ruchu."
            ]
        ],
        "2.3. Cele ćwiczenia":
        [
            [
                "Nie modyfikuj",
                "Podstawowe cele ćwiczenia:\
                1. wyznaczyć wartość przyspieszenia ziemskiego;\
                2. uzasadnić wpływ długości wahadła na otrzymaną wartość g."
            ]
        ],
        "2.4. Przeprowadzenie pomiarów":
        [
            [
                "Nie modyfikuj",
                "1. Ustawić największą długość wahadła i zmierzyć długość linki L, od górnego mocowania linki do środka\
                ciężarka.\
                2. Zmierzyć czas trwania 10 okresów drgań wahadła pamiętając, że kąt początkowego wychylenia nie\
                może być większy od 10 stopni.\
                3. Pomiary z punktu 2 powtórzyć 12 razy i wyniki pomiarów wpisać do tabeli pomiarowej.\
                4. Czynności z punktu 2 i 3 przeprowadzić dla pięciu długości L wahadła zmniejszając ją o stałą wartość\
                (np. o ok. 4 – 6 cm) i wyniki pomiarów wpisać do tabeli pomiarowej. (Minimalna długość L nie\
                powinna być krótsza od 25 cm.)\
                5. Oszacować i zapisać niepewności użytych narzędzi pomiarowych."
            ]
        ],
        "2.5. Metoda pomiarów, wyznaczania niepewności":
        [
            [
                "Przepisz w 3 zdaniach",
                "Pomiar długości wahadła wykonano linijką z niepewnością wyznaczoną metodą typu A, równą najmniejszej przedziałce, czyli 1 mm."
            ],
            [
                "Przepisz w 3 zdaniach",
                "Pomiar okresu drgania wahadła wykonano stoperem w telefonie z niepewnością wyznaczoną metodą typu A, równą najmniejszej przedziałce, czyli 1 ms.\
                Należy również uwzględnić niepewność wynikającą z czasu reakcji eksperymentatora, wyznaczoną metodą typu B."
            ]
        ],
        "3. Opracowanie pomiarów":
        [
            [
                "Przepisz jednym zdaniem",
                "3.1. Uzupełnienie tabeli nr 1. wynikami pomiarów długości wahadła"
            ],
            [
                "Przepisz jednym zdaniem",
                "3.2. Określić niepewność pomiaru długości wahadła."
            ],
            [
                "Przepisz jednym zdaniem",
                "3.3. Wyniki pomiarów czasu trwania 10 okresów drgań wpisać do tabeli nr 1. odrzucając dwie skrajne wartości"
            ],
            [
                "Przepisz jednym zdaniem",
                "3.4 Oblicz średnią wartość czasu trwania 10 okresów dla każdej długości wahadła, oraz czas trwania 1 okresu."
            ],
            [
                "Przepisz jednym zdaniem",
                "3.5 Oblicz niepewność pomiaru czasu na podstawie odchylenia standardowego serii pomiarów."
            ],
            [
                "Przepisz jednym zdaniem",
                "3.6 Wyznacz wartość przyśpieszenia ziemskiego oraz jego niepewność standardową i rozszerzoną."
            ],
            [
                "Przepisz jednym zdaniem",
                "3.7 Wyniki obliczeń wstaw do tabeli nr 1."
            ],
            [
                "Przepisz jednym zdaniem",
                "3.8 Wykonaj wykres wartości przyśpieszenia w funkcji długości wahadła wraz ze znacznikami niepewności pomiarowych."
            ],
            [
                "Przepisz jednym zdaniem",
                "3.9 Na wykresie zaznacz tablicową wartość przyśpieszenia ziemskiego, jako linie prostą."
            ]
        ],
        "4. Podsumowanie":
        [
            [
                "Przepisz w kilku zdaniach",
                `4.1. Zestawienie:\
                Ostateczna wartość przyśpieszenia ziemskiego wynosi: ${gravityCalculations["g"]}, z niepewnością rozrzeszoną równą ${gravityData["expUnc"]}.`
            ],
            [
                "Przepisz w kilku zdaniach",
                `4.2. Analiza:\
                a) Uzyskane wyniki mieszczą się w granicach rozszerzonych niepewności pomiarowych z wartościami tablicowymi przyśpieszenia ziemskiego.\
                b) Im dłuższe wahadło poprawia dokładność uzyskanych wyników.`
            ],
            [
                "Przepisz w kilku zdaniach",
                `Błędy grube, zostały usunięte na początku opracowania, przez odrzucenie skrajnych wartości.\
                Błędy systematyczne mogą występować przez warunki stanowiska, przy którym wykonywano doświadczenie.\
                Błędy przypadkowe występują zawsze, dlatego aby je zrównoważyć skorzystano z praw statystyki przy opracowaniu pomiarów.`
            ],
            [
                "Przepisz w kilku zdaniach",
                "Aby zmniejszyć występowanie błędów przypadkowych i grubych, należałoby zastąpić eksperymentatora, automatycznym systemem do pomiaru czasu.\
                Dodatkowo zwiększenie liczby pomiarów w serii i skorzystanie z dłuższego wahadła, również wpłynie pozytywnie na dokładność wyników."
            ],
            [
                "Przepisz w kilku zdaniach",
                "Podstawowe cele ćwiczenia, czyli wyznaczenie wartości przyśpieszenia ziemskiego oraz uzasadnienie wpływu długości wahadła na otrzymany wynik,\
                zostały w pełni zrealizowane."
            ]
        ]
    }



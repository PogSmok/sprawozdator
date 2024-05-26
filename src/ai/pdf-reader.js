import * as openai from "./openai.js";
import * as htmlwriter from "./html-writer.js";
import fs from "fs";

class PdfData {
    //string
    theoreticalOverview;
    //array
    tasks;
} 

const tasks = {
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
            Ostateczna wartość przyśpieszenia ziemskiego wynosi: 9.82192, z niepewnością rozrzeszoną równą 1.2412}.`
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

export async function writeRaport(file) {
    const arr = []; 
    for (const [key, value] of Object.entries(tasks)) {
        value.forEach((v) => {
            arr.push(openai.createExplanation(v[0]+" "+v[1]));
         });
    }

    Promise.all(arr).then((values) => {
        console.log(values);
        let index = 0;
        let content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<link rel="shortcut icon" href="#">\n</head>\n`;
        for (const [key, value] of Object.entries(tasks)) {
            content += `<div style="font-size:50px;margin-top:50px;">${key}</div>\n`;
            value.forEach((v) => {
                content += `<div style="font-size: 25px">${values[index++]}</div>\n`;
             });
        }
        fs.writeFile(file, content, function(err) {
            if(err) return console.log(err);
            console.log("Wrote to res.html");
        }); 
    })
}
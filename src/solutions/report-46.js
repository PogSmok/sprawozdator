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
        measure = measurements[val];
        max = -1;
        min = 10000;
        avg = average(measure);
        for (tmp in range(2)) {
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
    periodOfTen = {};
    periodOfOne = {};
    inSeries.forEach((val) => {
        periodOfTen[val] = average(measurements[val]);
        periodOfOne[val] = periodOfTen[val] / 10;
    });
    return [periodOfTen, periodOfOne];
}

function fifthStep(measurements, inSeries) {
    // u(T) and sigma(T), deltaT
    stdUnc = {};
    expUnc = {};
    stdDev = {};
    dT = 0.02;

    inSeries.forEach((val) => {
        stdDev[val] = standardDeviation(measurements[val], average(measurements[val]));
        stdUnc[val] = Math.sqrt(stdDev[val]**2 + (dT**2)/3);
        expUnc[val] = stdUnc[val] * 2;
    })

    return [stdDev, stdUnc, expUnc, dT];
}

function sixthStep(periods, inSeries, uL, uT) {
    // calculate g u(g) and U(g)
    g = {};
    stdUnc = {};
    expUnc = {};
    inSeries.forEach((val) => {
        g[val] = parseFloat(val) * ((Math.PI*2) / periods[val])**2;
        stdUnc[val] = Math.sqrt( (((16 * (Math.PI ** 4)) / (periods[val])) * (uL**2)) + (((64 * (Math.PI ** 4) * (parseFloat(val)**2)) / (periods[val] ** 6))*(uT[val] ** 2)) );
        expUnc[val] = stdUnc[val] * 2;
    })
    return [g, stdUnc, expUnc];
}

function seventhStep() {
    // create table from 5. and 6.
}

function eightStep(gravity, inSeries) {
    let G = 9.8123;
    constGrav = [];
    gravityData = [];
    inSeries.forEach((val) => {
        gravityData.push(gravity[0][val])
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

function ninthStep() {
    
    // mark constant value of g as a line on graph
}

console.log(userData, userSeries);
measurements = firstStep(userData, userSeries);
console.log(measurements);
lengthUncertainties = secondStep();
measurements = thirdStep(measurements, userSeries);
console.log(measurements);
periods = fourthStep(measurements, userSeries);
console.log("Periods")
console.log(periods[0]);
console.log(periods[1]);
periodUncertainties = fifthStep(measurements, userSeries);
console.log("Uncertainties")
console.log(periodUncertainties[0]);
console.log(periodUncertainties[1]);
console.log(periodUncertainties[2]);
console.log(periodUncertainties[3]);
gravityCalculations = sixthStep(periods[1], userSeries, lengthUncertainties[1], periodUncertainties[1]);
console.log("Gravity");
console.log(gravityCalculations[0]);
console.log(gravityCalculations[1]);
console.log(gravityCalculations[2]);
eightStep(gravityCalculations, userSeries);
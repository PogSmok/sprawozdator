
//// User input

let userSeries =
// Number of weights in a series of measurements
[
    0, 3, 6, 9, 12, 15
];

let userData = 
// Measurements
{
    "static": 
    [ // [m]
        0.219,0.221,0.218,0.219,0.217,0.219,
        0.266,0.264,0.267,0.264,0.265,0.266,
        0.308,0.31,0.309,0.308,0.307,0.308,
        0.357,0.354,0.355,0.356,0.354,0.357,
        0.403,0.404,0.402,0.401,0.4,0.403,
        0.45,0.452,0.453,0.451,0.451,0.45
    ],
    "dynamic":
    [ // [s]
        7.47,6.99,7.48,7.27,7.27,
        9.23,8.72,9.1,8.5,8.9,
        9.56,9.96,9.56,10.04,9.42,
        10.54,10.74,10.76,10.35,10.54,
        11.21,11.65,11.62,11.12,11.4,
        11.99,12.24,11.69,12.38,12.3
    ]
}

let restingLength = 0.22; // [m]
let periodsInSingleMeasurement = 10; // [1]
let outerSpringDiameter = 8.5; // [mm]
let innerSpringDiameter = 8.0; // [mm]
let cableDiameter = 0.5; // [mm]

////

function getLinePoints(xSeries, a, b) {
    points = [];
    xSeries.forEach((val) => {
        points.push(val*a + b);
    })
    return points;
}

function weight(inSeries) {
    // all in standard units [kg]
    let weightMass = 0.00446;
    weights = [];
    inSeries.forEach((val) => {
        weights.push(val * weightMass);
    })
    return weights;
}

function average(xSeries) {
    let sum = 0;
    xSeries.forEach(val => sum += val);
    return sum / xSeries.length;
}

function standardDeviation(xSeries, average) {
    let sum = 0;
    xSeries.forEach((val) => {
        sum += (val - average)**2;
    });
    return Math.sqrt(sum/(xSeries.length-1));
}

function linearRegression(xSeries, ySeries) {
    Sx = 0;
    Sy = 0;
    Sxy = 0;
    Sxx = 0;
    Syy = 0;

    for (let i = 0; i < xSeries.length; i++) {
        Sx += xSeries[i];
        Sy += ySeries[i];
        Sxy += xSeries[i] * ySeries[i];
        Sxx += xSeries[i] * xSeries[i];
        Syy += ySeries[i] * ySeries[i];
    };

    let A = ((xSeries.length * Sxy) - (Sx * Sy)) / ((xSeries.length * Sxx) - (Sx**2));
    let B = ((Sxx * Sy) - (Sx * Sxy)) / ((xSeries.length * Sxx) - (Sx**2));
    let uA = Math.sqrt( (xSeries.length * (Syy - (A * Sxy) - (B * Sy))) / ((xSeries.length - 2)*((xSeries.length*(Sx**2))-(Sx**2))));
    let uB = uA * Math.sqrt(Sxx/xSeries.length);
    return {"A":A, "B":B, "uA":uA, "uB":uB};
}

function divideMeasurements(inData, inSeries) {
    if (inSeries.length != 6) {
        console.error("Expected 6 series of measurements");
        return -1;
    }

    let measurments = {};
    let msrInSeries = Math.floor(inData.length / inSeries.length);

    inSeries.forEach((val) => {measurments[val] = []});

    for (let i = 0; i < inData.length; i++) {
        measurments[inSeries[Math.floor(i / msrInSeries)]].push(parseFloat(inData[i]));
    }
    return measurments;
}

function graph1(xSeries, ySeries, A, B) {

    new Chart(
        document.getElementById("graph1"),
        {
            type: "scatter",
            data:
            {
                labels: xSeries,
                datasets:
                [
                    {
                        label: "Średnie wydłużenie sprężyny pod wpływem ciężaru",
                        data: ySeries
                    },
                    {
                        label: "Prosta regresji liniowej",
                        data: getLinePoints(xSeries, A, B),
                        type: "line"
                    }
                ]
            },
            scales:
            {
                y:
                {

                }
            }
        }
    )
}

function graph2(xSeries, ySeries, A, B) {

    new Chart(
        document.getElementById("graph2"),
        {
            type: "scatter",
            data:
            {
                labels: xSeries,
                datasets:
                [
                    {
                        label: "Średnie okresy drgania sprężyny pod wpływem ciężaru",
                        data: ySeries
                    },
                    {
                        label: "Prosta regresji liniowej",
                        data: getLinePoints(xSeries, A, B),
                        type: "line"
                    }
                ]
            },
            scales:
            {
                y:
                {

                }
            }
        }
    )
}


function firstStep(inData, inSeries) {
    let measurements = divideMeasurements(inData, inSeries);
    stdDev = {};
    avg = {};

    inSeries.forEach((val) => {
        avg[val] = average(measurements[val]);
        stdDev[val] = standardDeviation(measurements[val], avg[val]);
    })

    return [avg, stdDev];
}

function secondStep(weights, averageMeasurements) {
    ySeries = [];
    weights.forEach((val) => {
        ySeries.push(averageMeasurements[val] - restingLength);
    })
    lineParams = linearRegression(weights, ySeries);
    graph1(weights, ySeries, lineParams["A"], lineParams["B"]);
    return lineParams;
}

function thirdStep(lineParameters) {
    let G = 9.81225;
    let k = G / lineParameters["A"];
    let uK = (lineParameters["uA"] * G) / (lineParameters["A"]**2);
    let UK =  uK * 2;
    let urK = uK / k;
    return {"k": k, "uK": uK, "UK": UK, "urK": urK};
}

function fourthStep(inData, inSeries) {
    let measurements = divideMeasurements(inData, inSeries);
    mList = [];
    mDict = {};
    stdDev = {};
    inSeries.forEach((val) => {
        mDict[val] = average(measurements[val]) / periodsInSingleMeasurement;
        mList.push(mDict[val]);
    });

    inSeries.forEach((val) =>{
        stdDev[val] = standardDeviation(mList, average(mList));
    })

    return [mDict, stdDev];
}

function fifthStep(weights, averagePeriods) {
    ySeries = [];
    weights.forEach((val) => {
        ySeries.push(averagePeriods[val]**2);
    })
    lineParams = linearRegression(weights, ySeries);
    graph2(weights, ySeries, lineParams["A"], lineParams["B"]);
    return lineParams;
}

function sixthStep(lineParameters) {
    let G = 9.81225;
    let k = (4 * (Math.PI ** 2)) / lineParameters["A"];
    let uK = (lineParameters["uA"] * G) / (lineParameters["A"]**2);
    let UK =  uK * 2;
    let urK = uK / k;
    return {"k": k, "uK": uK, "UK": UK, "urK": urK};
}

function seventhStep(springStaticCoefficient, springDynamicCoefficient) {
    // meters converted to milimeters
    let springRadius = ( (innerSpringDiameter / 2) + (outerSpringDiameter / 2) ) / 2;
    let numberOfCoils = (restingLength*1000) / cableDiameter;
    staticG = (4*numberOfCoils*(springRadius**3)*(springStaticCoefficient["k"]/1000)) / ((cableDiameter / 2)**4);
    dynamicG = (4*numberOfCoils*(springRadius**3)*(springDynamicCoefficient["k"]/1000)) / ((cableDiameter / 2)**4);
    dN = 1;
    dR = 0.01;
    dr = 0.01;
    dK1 = 3 * (springStaticCoefficient["uK"]/1000);
    dK2 = 3 * (springDynamicCoefficient["uK"]/1000);
    dG1 = staticG * ((dN/numberOfCoils)+(3*dR/springRadius)+(4*dr/(cableDiameter/2))+(dK1/(springStaticCoefficient["k"]/1000)));
    dG2 = dynamicG * ((dN/numberOfCoils)+(3*dR/springRadius)+(4*dr/(cableDiameter/2))+(dK2/(springDynamicCoefficient["k"]/1000)));
    return {"static": {"G": staticG, "dG": dG1}, "dynamic": {"G": dynamicG, "dG": dG2}};
}

weights = weight(userSeries);
averageLength = firstStep(userData["static"], weights);
console.log("Average lengths and standard deviation");
console.log(averageLength);
lineOneParameters = secondStep(weights, averageLength[0], restingLength);
console.log("Line parameters");
console.log(lineOneParameters);
springStaticCoefficient = thirdStep(lineOneParameters);
console.log("Spring Static Coefficient");
console.log(springStaticCoefficient);
averagePeriods = fourthStep(userData["dynamic"], weights);
console.log("Average periods and standard deviation");
console.log(averagePeriods);
lineTwoParameters = fifthStep(weights, averagePeriods[0]);
console.log("Second line parameters");
console.log(lineTwoParameters);    
springDynamicCoefficient = sixthStep(lineTwoParameters);
console.log("Spring Dynamic Coefficient");
console.log(springDynamicCoefficient);
kirchoffModule = seventhStep(springStaticCoefficient, springDynamicCoefficient);
console.log("Kichoff's stiffness module");
console.log(kirchoffModule);
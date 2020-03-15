let size = 10;

document.getElementById('lambda').onkeyup = () => {
    draw() ;
}

document.getElementById('time').onkeyup = () => {
    draw() ;
}

$('.table-item').mouseover(e => {
    draw(e.currentTarget.id);
})

$('.generated-table').mouseleave(e => {
    draw(-1);
})

let myChart;
let bigOne = []

for(let i = 0; i < size; ++i)
{
    bigOne.push(0);
}

draw();

function draw(idx = -1) {


    let borderForGraph = [];
    let colorForGraph = [];
    let dataForGraph = [];
    let labelsForGraph = [];
    for(let i = 0; i < size; ++i)
    {
        dataForGraph.push(PoissonDistribution(i));
        labelsForGraph.push(i + '');

        if(i == idx)
        {
            borderForGraph.push('#386685');
            colorForGraph.push('#2380be');
        }
        else
        {
            borderForGraph.push('#cfcfcf');
            colorForGraph.push('#e5e5e5');
        }
    }

    if(!myChart)
    {
        var ctx = document.getElementById('canvas').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelsForGraph,
                datasets: [{
                    label: 'distribution',
                    data: dataForGraph,
                    borderWidth: 1,
                    backgroundColor : colorForGraph,
                    borderColor : borderForGraph
                },
                {
                    label: 'real',
                    data: bigOne,
                    borderWidth: 1,
                    backgroundColor : '#71d358',
                    borderColor : '#51944b'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                       label: function(tooltipItem) {
                              return tooltipItem.yLabel;
                       }
                    },
                    responsive : false
                },
            }
        });
    }
    else
    {
        myChart.data.datasets[0].data = dataForGraph;
        myChart.data.datasets[0].backgroundColor = colorForGraph;
        myChart.data.datasets[0].borderColor = borderForGraph;

        myChart.data.datasets[1].data = bigOne;

        myChart.update();
    }  
    
}

document.getElementById('gen').onclick =() => {

    if(document.getElementById('gen').getAttribute('disabled'))
        return;



    let s = document.getElementById('repeat').value;
    s = parseInt(s);

    if(s === Number.NaN)
        return;

    document.getElementById('gen').setAttribute('disabled','disabled');
    generate(s);    
};


let NUM = 0;

function generate(repeat)
{

    if(repeat == 0)
    {
        document.getElementById('gen').removeAttribute('disabled');
        return;
    }

    let l = parseFloat(document.getElementById('lambda').value);
    let t = parseFloat(document.getElementById('time').value);

    if(l === Number.NaN || t === Number.NaN)
        return;


    let k = 0;


    let rand = Math.random();
    let left = 0;
    let right = Math.exp(- t * l);

    let lastP = Math.exp(- t * l);

    console.log("RAND: " + rand)

    while(rand < left || rand > right)
    {

        ++k;
        left = right;
        lastP = lastP * (l * t) / k;
        right = right + lastP;


        if(k === size + 1)
            break;
    }

    NUM++;

    let num = 0;
    let el = $('#' + k + ' .table-val');
    if(el)
        num = el.html();

    num = parseInt(num) + 1;
    el.html(num);

    for(let i = 0; i < size; ++i)
    {
        let s = parseInt($('#' + i + ' .table-val').html());
        $('#' + i + ' .table-probability').html(s / NUM);
        $('#' + i + ' .table-probability').attr('title',s / NUM);
        bigOne[i] = s / NUM;
    }

    console.log("X: " + k);

    draw();
    setTimeout(() => {
        generate(repeat - 1);
    }, 5);

}

    
function PoissonDistribution(k) {
    
        
    let l = parseFloat(document.getElementById('lambda').value);
    let t = parseFloat(document.getElementById('time').value);

    if(l === Number.NaN || t === Number.NaN)
        return;

    let res = (Math.pow(l * t, k)/factorial(k)) * Math.exp(- l * t);

    return res;

}

function factorial(n) {
    if(n === 0)
        return 1;

    return factorial(n-1) * n;
}

document.getElementById('clr').onclick = () => {
    location.reload();
}
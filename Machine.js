//https://jsfiddle.net/ - JavaScript HTML CSS sandbox
//https://codepen.
//console.log('r/place');
// Checking for Support
// One way to programmatically check for "canvas" support is to test for the presence of the getContext() method.
//
// radians = (Math.PI/180)*degrees
/******************************************
Authors:    Redge Shepherd
Created:    02-02-2018

new Date()
new Date(milliseconds)
new Date(dateString)
new Date(year, month, day, hours, minutes, seconds, milliseconds) 
//*****************************************/
var shiftStart = new Date();
var strShiftDate = dateStamp(shiftStart);
var strShiftTime = timeStamp(shiftStart);

document.getElementById('sessionDateTime').innerHTML += (strShiftDate + " " + strShiftTime);

/* Machine Configuration / Setup Data */
var machineName = 'Versalytics';
var machineCount = 3;
var batchSizeMin = 50;
var batchSizeMax = 100;
var machineStroke = 30;
//var stdDevNCQ = 2.25;

var canvasHeight = "800px";

/*  There is a better way to handle each of these using
    an event listener for the mouse click and evaluating
    the element that was clicked.  This is working but
    demands a lot of unnecessary setup.
*/

document.getElementById('btnMachinesToggle').addEventListener('click', machinesToggle);
document.getElementById('btnMachinesStart').addEventListener('click', machinesStart);
document.getElementById('btnMachinesStop').addEventListener('click', machinesStop);
document.getElementById('btnCycleEnd').addEventListener('click', machineCycleEnd);
document.getElementById('btnStop').addEventListener('click', machineStop);
//document.getElementById('btnRun').addEventListener('click', machineRun);
document.getElementById('btnResume').addEventListener('click', machineResume);
document.getElementById('btnReset').addEventListener('click', machineReset);
document.getElementById('btnOEE').addEventListener('click', machineOEE);
document.getElementById('btnCounters').addEventListener('click', machineCounters);

var machinesRunning = false;

function machinesToggle(e)
{
    let machineState = document.getElementById('btnMachinesToggle');
    // machinesRunning = !machinesRunning;
    /*  If the machines are NOT running - reset the startTime for
        each machine then toggle the machinesRunning flag.
     */
    if (!machinesRunning){
        //machineState.innerHTML = "Machines:   ON";
        machineState.childNodes[0].nodeValue = "Machines:   ON";
        console.log("Reseting time!");
        let resetTime = Date.now();
        for (var i=0; i < machineArray.length; i++) {
            console.log(machineArray[i].id + " Started: " + machineArray[i].machineRun);
            machineArray[i].startTime = resetTime;
            machineArray[i].cycleBgn = resetTime;
            machineArray[i].cycleEnd = resetTime;
            //machineArray[i].jobBgn = resetTime;
            machineArray[i].lapseTime = 0;
        }
    } else {
        //machineState.innerHTML = "Machines:  OFF";
        machineState.childNodes[0].nodeValue = "Machines:  OFF";
        //document.getElementById('btnMachinesStart').innerHTML = "Machines:  OFF";
    }
    machinesRunning = !machinesRunning;

    machineState.style.width = "120px";
}

function machinesStart(e)
{
    console.log("Starting Machines");

    /*  Reset startTime variable for each
        machine before turning it back on!
    */

    machinesRunning = false;
    machinesToggle(e);
}

function machinesStop(e)
{
    //alert("Machines should stop!");
    machinesRunning = true;
    machinesToggle(e);
}

function machineCycleEnd(e)
{
    console.log("Cycle End:  " + (machineArray.length));
    for (var i=0; i < machineArray.length; i++) {
        machineArray[i].machineHome = true;
        machineArray[i].machineRun = true;
        //machineArray[i].machineRun = true;
        console.log(machineArray[i].id + " Status: " + machineArray[i].machineRun);
    }
}

function machineStop(e)
{
    console.log("Stop Machine - Pressed");
    for (var i=0; i < machineArray.length; i++) {
        console.log(machineArray[i].id + " Before Status: " + machineArray[i].machineRun);
        machineArray[i].machineRun = false;
        machineArray[i].jobRun = false;
        machineArray[i].startDownTime = new Date();
        console.log(machineArray[i].id + " After Status: " + machineArray[i].machineRun);
    }
}

function machineRun(e)
{
    console.log("Run Machine - Pressed");
    for (var i=0; i < machineArray.length; i++) {
        console.log(machineArray[i].id + " Before Status: " + machineArray[i].machineRun);
        machineArray[i].machineStart();
        console.log(machineArray[i].id + " After Status: " + machineArray[i].machineRun);
    }
}

function machineResume(e)
{
    console.log("Resume Machine - Pressed");
    for (var i=0; i < machineArray.length; i++) {
        console.log(machineArray[i].id + " Before Resume Status: " + machineArray[i].machineRun);
        
        machineArray[i].machineHome = false;
        machineArray[i].machineRun = true;
        machineArray[i].jobRun = true;
        //machineStart();
        console.log(machineArray[i].id + " After Resume Status: " + machineArray[i].machineRun);
    }
}

function machineReset()
{
    /*  When we enter the function here from the Reset button,
        the animation is already active so we don't have to call
        the animate function again.

        This function was also called with an "e" event but we
        don't need the details of the event at this point so it
        was removed as a function parameter.
    */

    console.log("Reset Machine");
    machinesRunning = false;
    init(machineName, machineCount, machineStroke, batchSizeMin, batchSizeMax);
    for (var i=0; i < machineArray.length; i++)
    {
        machineArray[i].update();
    }
    /*
    animate();
    */
}

function machineOEE(e)
{
    console.log("OEE Machine - Pressed");
}

function machineCounters(e)
{
    console.log("Counters Machine - Pressed");
}

var canvasSpace = document.getElementById('machineSpace');

if (canvasSpace.getContext) {
    var ctx = canvasSpace.getContext('2d');
    // drawing code here
} else {
    canvasSpace.innerHTML = "Canvas Graphics Not Supported!<br/>";
}

//var setupForm = document.getElementById('setupMachines');

 setupMachines = function() {
    alert("Reset All Machines!");
    machineName = document.getElementById('customer').value;
    machineCount = parseInt(document.getElementById('machineCount').value);
    machineStroke = parseInt(document.getElementById('machineStroke').value);
    batchSizeMin = parseInt(document.getElementById('batchMin').value);
    batchSizeMax = parseInt(document.getElementById('batchMax').value);

    var errorCount = 0;
    var validate = "";
    if (machineName.length > 0) {
        validate += "Company Name:  OK";
    } else
        {
            validate += "Company Name - Missing";
            ++errorCount;
        }

    if (machineCount > 0 || machineCount < 11) {
        validate += "Machines:  OK<br>";
    } else {
        validate += "Machines:  1 - 10<br>";
        ++errorCount;
    }

    if (batchSizeMin > 0 && batchSizeMin <= batchSizeMax) {
        validate += "Batch Min:  OK<br/>";
    } else {
        validate += "Batch Min:  0 < Batch Min < Batch Max<br>";
        ++errorCount;
    }

    if (batchSizeMax > 0 && batchSizeMax >= batchSizeMin) {
        validate += "Batch Max:  OK<br>";
    } else {
        validate += "Batch Max:  0 < Batch Min < Batch Max<br>";
        ++errorCount;
    }

    if (errorCount > 0) {
        alert("Errors encountered <br>" + validate);
        return false;
    }
    else {
        //alert("Welcome!  " + machineName + " MachineCount = " + machineCount + " Min = " + batchSizeMin + " Max = " + batchSizeMax + "<br>");
        startMachines = true;
    }
    // alert("Message = " + validate);
    // prevent further bubbling of the event - return false
    // We need to clear the canvas before restarting the machines;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2;
    init(machineName, machineCount, machineStroke, batchSizeMin, batchSizeMax);

     return false;
}
//*/

var canvas = document.querySelector('canvas');
//console.log(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 2;

var tdcAngle = Math.PI * 1.5;

var c = canvas.getContext("2d");

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2;
    init(machineName, machineCount, machineStroke, batchSizeMin, batchSizeMax);
});

function PressRam(id, machineName, startTime, batchCount, x, y, ramWidth, ramHeight, stroke, shutHeight, rate, clearance, lhSide, rhSide, upSide, loSide, tBolster, bBolster, tDieShoeHeight, tDieShoeWidth, bDieShoeHeight, bDieShoeWidth, materialThickness, dwellTime, openTime, sigma) {
    // Machine Status
    this.machineHome = false;
    this.machineRun = true;
    this.machineFault = false;
    this.machineIdle = false;

    this.runTime = 0;

    this.startDownTime = 0;
    this.cycleDownTime = 0;
    this.downTime = 0;

    this.startTime = startTime;
    this.jobRun = true;
    this.jobBgn = new Date();  //Date.now();
    this.jobEnd = new Date();
    this.jobTime = 0;
    this.jobGood = 0;
    this.jobGoodTime = 0;
    this.jobHold = 0;
    this.jobHoldTime = 0;
    this.jobComplete = false;
    

    this.cycleBgn = new Date();
    this.cycleEnd = 0;
    this.cycleTime = 0;
    this.lapseTime = 0;
    this.cycleCount = 0;
    this.cycleMin = 0;
    this.cycleMax = 0;
    this.cycleAvg = 0;
    this.cycleRng = 0;
    this.cycleStdDev = 0;

    // Array to store cycle times
    this.cycleData = [];

    this.runCount = 1;
    this.batchCount = batchCount;
    this.jobNumber = '102018-01';
    
    this.machineName = machineName;
    this.id = id;
    this.x = x;
    this.y = y;
    this.tdc = y;
    this.bdc = y + stroke;
    this.shutHeight = shutHeight;
    this.dy = rate;
    this.ramWidth = ramWidth;
    this.ramHeight = ramHeight;
    this.stroke = stroke;
    this.dwellTime = dwellTime;
    this.dwellNow = 0;
    this.openTime = openTime;
    this.openNow = openTime;

    this.sigma = sigma;

    // originally set to false but
    // we may need to DWELL first;
    this.Dn = true;

    this.tBolsterX = x;
    this.tBolsterY = y + ramHeight;
    this.tBolsterWidth = ramWidth;
    this.tBolsterHeight = tBolster;

    this.tDieShoeX = x + ((ramWidth - tDieShoeWidth) / 2);
    this.tDieShoeY = y + ramHeight + tBolster;
    this.tDieShoeWidth = tDieShoeWidth;
    this.tDieShoeHeight = tDieShoeHeight;

    this.frameXpos = x - (clearance + lhSide);
    this.frameWidth = (lhSide + clearance + ramWidth + clearance + rhSide);
    this.frameYpos = y - (upSide + stroke);
    this.frameHeight = ((upSide + stroke) + ramHeight + tBolster + stroke + shutHeight + bBolster + loSide);

    this.openXpos = x - clearance;
    this.openYpos = y;
    this.openWidth = clearance + ramWidth + clearance;
    this.openHeight = ramHeight + tBolster + stroke + shutHeight + bBolster;

    this.bDieShoeX = x + ((ramWidth - bDieShoeWidth) / 2);
    this.bDieShoeY = y + ramHeight + tBolster + tDieShoeHeight + stroke + materialThickness;
    this.bDieShoeWidth = bDieShoeWidth;
    this.bDieShoeHeight = bDieShoeHeight;

    this.bBolsterX = x;
    this.bBolsterY = y + ramHeight + tBolster + stroke + shutHeight;
    this.bBolsterWidth = ramWidth;
    this.bBolsterHeight = bBolster;

    this.gaugeForeGround = '#FF0000';
    this.gaugeBackGround = '#00FF00';
    this.travelAngle = 0;
    this.travelRadius = (loSide - 20) / 2;
    this.travelPosX = x + (ramWidth / 2);
    this.travelPosY = y + ramHeight + tBolster + stroke + shutHeight + bBolster + (loSide / 2);

    this.color = 'rgb(180, 255, 200)';
    //this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    // Machines Settings Panel

    c.fillStyle = 'rgb(180, 240, 200)';
    c.fillRect(this.frameXpos, this.frameYpos - 100, this.frameWidth, 95);

    c.font = '10px ariel';
    c.fillStyle = '#000000';

    c.fillText(this.machineName, this.frameXpos + 3, this.frameYpos - 88, this.frameWidth -6 );
    c.fillText("Start Date:", this.frameXpos + 3, this.frameYpos - 76, this.frameWidth - 6 );
    c.fillText(dateStamp(this.startTime), this.frameXpos + 54, this.frameYpos - 76, this.frameWidth - 6 );
    c.fillText("Start Time:", this.frameXpos + 3, this.frameYpos - 64, this.frameWidth - 6);
    c.fillText(timeStamp(this.startTime), this.frameXpos + 54, this.frameYpos - 64, this.frameWidth - 6 );

    c.fillText("Settings", this.frameXpos + 3, this.frameYpos - 48, this.frameWidth - 6);

    c.fillText("Open Time:", this.frameXpos + 3, this.frameYpos - 32, this.frameWidth - 6);
    c.fillText(this.openTime, this.frameXpos + 60, this.frameYpos - 32, this.frameWidth - 6);
    c.fillText("Dwell Time:", this.frameXpos + 3, this.frameYpos - 20, this.frameWidth - 6);
    c.fillText(this.dwellTime, this.frameXpos + 60, this.frameYpos - 20, this.frameWidth - 6);
    c.fillText("Run Rate:", this.frameXpos + 3, this.frameYpos - 8, this.frameWidth - 6);
    c.fillText(this.dy, this.frameXpos + 60, this.frameYpos - 8, this.frameWidth - 6);

    this.draw = function () {
        if (this.machineRun) {
            if (!this.jobRun){
                console.log("***********< " + this.id + "Just Stopped >***********");
            }
            // Draw Frame
            c.fillStyle = '#F3E3CC';
            c.fillRect(this.frameXpos, this.frameYpos, this.frameWidth, this.frameHeight);
            c.strokeRect(this.frameXpos, this.frameYpos, this.frameWidth, this.frameHeight);

            // Draw Text to PRESS Top
            c.fillStyle = '#000000';
            c.font = '10px ariel';
            c.fillText("Job #:  " + this.jobNumber, this.frameXpos + 3, this.frameYpos + 16, this.frameWidth - 6);
            c.fillText("Count:  " + Math.floor(this.runCount / 2), this.frameXpos + 3, this.frameYpos + 28, this.frameWidth - 6);
            c.fillText("Good:  " + this.jobGood, this.frameXpos + (this.frameWidth / 2) + 3, this.frameYpos + 28, this.frameWidth - 6);
            c.fillText("Batch:  " + Math.floor(this.batchCount), this.frameXpos + 3, this.frameYpos + 40, this.frameWidth - 6);
            c.fillText("Hold:  " + this.jobHold, this.frameXpos + (this.frameWidth / 2) + 3, this.frameYpos + 40, this.frameWidth - 6);

            //c.fillText(string, x, y, maxwidth);
            //c.clearRect(this.frameXpos + 3, this.frameHeight + this.frameYpos + 3, this.frameWidth, 46);

            c.fillRect(this.frameXpos, this.frameHeight + this.frameYpos + 3, this.frameWidth, 76);

            // Draw Text to Display Panel
            var statColumn = 54;
            c.fillStyle = 'white';
            c.fillText("Cycle:", this.frameXpos + 4, this.frameHeight + this.frameYpos + 15, this.frameWidth - 6);
            c.fillText(this.lapseTime.toFixed(3), this.frameXpos + statColumn, this.frameHeight + this.frameYpos + 15, this.frameWidth - 6);
            c.fillText("Min:", this.frameXpos + 4, this.frameHeight + this.frameYpos + 27, this.frameWidth - 6);
            c.fillText(this.cycleMin.toFixed(3), this.frameXpos + statColumn, this.frameHeight + this.frameYpos + 27, this.frameWidth - 6);
            c.fillText("Max:", this.frameXpos + 4, this.frameHeight + this.frameYpos + 39, this.frameWidth - 6);
            c.fillText(this.cycleMax.toFixed(3), this.frameXpos + statColumn, this.frameHeight + this.frameYpos + 39, this.frameWidth - 6);
            c.fillText("Avg:", this.frameXpos + 4, this.frameHeight + this.frameYpos + 51, this.frameWidth - 6);
            c.fillText(this.cycleAvg.toFixed(3), this.frameXpos + statColumn, this.frameHeight + this.frameYpos + 51, this.frameWidth - 6);
            c.fillText("Range:", this.frameXpos + 4, this.frameHeight + this.frameYpos + 63, this.frameWidth - 6);
            c.fillText(this.cycleRng.toFixed(3), this.frameXpos + statColumn, this.frameHeight + this.frameYpos + 63, this.frameWidth - 6);
            c.fillText("StdDev:", this.frameXpos + 4, this.frameHeight + this.frameYpos + 75, this.frameWidth - 6);
            c.fillText(this.cycleStdDev.toFixed(3), this.frameXpos + statColumn, this.frameHeight + this.frameYpos + 75, this.frameWidth - 6);

            c.fillStyle = 'black';
            c.fillRect(this.frameXpos, this.frameHeight + this.frameYpos + 82, this.frameWidth, 76);
            // Start Time Estimated Run Time, Actual Run Time.
            c.fillStyle = 'white';

            c.fillText("Job Start:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 94, this.frameWidth - 6);
            c.fillText(dateStamp(this.jobBgn) + " - " + timeStamp(this.jobBgn), this.frameXpos + 3, this.frameHeight + this.frameYpos + 106, this.frameWidth);
            c.fillText("Job Time:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 118, this.frameWidth);
            c.fillText(this.jobTime.toFixed(3), this.frameXpos + 54, this.frameHeight + this.frameYpos + 118, this.frameWidth);
            c.fillText("Cycles:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 130, this.frameWidth);
            c.fillText(this.cycleCount.toFixed(3), this.frameXpos + 54, this.frameHeight + this.frameYpos + 130, this.frameWidth);
            c.fillText("Job End:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 142, this.frameWidth - 6);
            c.fillText(dateStamp(this.jobEnd) + " - " + timeStamp(this.jobEnd), this.frameXpos + 3, this.frameHeight + this.frameYpos + 154, this.frameWidth);

            c.clearRect(this.openXpos, this.openYpos, this.openWidth, this.openHeight);
            // Draw Connecting Arms, Ram, and Machine ID
            c.fillStyle = '#000000';
            c.fillRect(this.x + Math.floor(ramWidth / 8), this.openYpos, Math.floor(ramWidth / 8), this.y - this.openYpos);
            c.fillRect(this.x + (this.ramWidth - (2 * Math.floor(ramWidth / 8))), this.openYpos, Math.floor(ramWidth / 8), this.y - this.openYpos);

            c.fillStyle = '#FFAA0D';
            c.fillRect(this.x, this.y, this.ramWidth, this.ramHeight);
            c.strokeRect(this.x, this.y, this.ramWidth, this.ramHeight);
            c.fillStyle = '#000000';
            c.fillText(this.id, this.x - 2 + Math.floor(ramWidth / 2), this.y + 5 + Math.floor(ramHeight / 2), ramWidth);

            // Draw Top Bolster
            c.fillStyle = '#333333';
            c.fillRect(this.tBolsterX, this.tBolsterY, this.tBolsterWidth, this.tBolsterHeight);

            // Draw Top and Bottom Die Shoes;
            c.fillStyle = '#00AA00';
            c.fillRect(this.tDieShoeX, this.tDieShoeY, this.tDieShoeWidth, this.tDieShoeHeight);

            c.fillRect(this.bDieShoeX, this.bDieShoeY, this.bDieShoeWidth, this.bDieShoeHeight);

            // Draw Bottom Bolster
            c.fillStyle = '#333333';
            c.fillRect(this.bBolsterX, this.bBolsterY, this.bBolsterWidth, this.bBolsterHeight);

            // Draw Travel Gauge
            c.beginPath();
            c.moveTo(this.travelPosX, this.travelPosY);
            c.arc(this.travelPosX, this.travelPosY, this.travelRadius, tdcAngle, tdcAngle + Math.PI * 2, false);
            c.lineTo(this.travelPosX, this.travelPosY);
            c.fillStyle = this.gaugeBackGround;
            c.fill();

            c.beginPath();
            c.moveTo(this.travelPosX, this.travelPosY);
            c.arc(this.travelPosX, this.travelPosY, this.travelRadius, tdcAngle, tdcAngle + this.travelAngle, false);
            c.lineTo(this.travelPosX, this.travelPosY);
            c.fillStyle = this.gaugeForeGround;
            c.fill();

            // Draw Origin
            c.beginPath();
            c.moveTo(this.travelPosX, this.travelPosY);
            c.arc(this.travelPosX, this.travelPosY, this.travelRadius + 1, tdcAngle, tdcAngle + Math.PI * 2, false);
            c.stroke();
        }
    }
    
    this.drawRunTime = function() {
        c.fillStyle = 'black';
        c.fillRect(this.frameXpos, this.frameHeight + this.frameYpos + 161, this.frameWidth, 54);
        // Start Time Estimated Run Time, Actual Run Time.
        c.fillStyle = 'white';
        c.fillText("Run Time:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 173, this.frameWidth -6 );
        c.fillText(this.runTime.toFixed(3), this.frameXpos + 54, this.frameHeight + this.frameYpos + 173, this.frameWidth -6 );
        c.fillText("Down Time:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 185, this.frameWidth -6 );
        c.fillText(this.downTime.toFixed(3), this.frameXpos + 54, this.frameHeight + this.frameYpos + 185, this.frameWidth -6 );
        c.fillText("FTQ Time:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 197, this.frameWidth -6 );
        c.fillText(this.jobGoodTime.toFixed(3), this.frameXpos + 54, this.frameHeight + this.frameYpos + 197, this.frameWidth -6 );
        c.fillText("NCQ Time:", this.frameXpos + 3, this.frameHeight + this.frameYpos + 209, this.frameWidth -6 );
        c.fillText(this.jobHoldTime.toFixed(3), this.frameXpos + 54, this.frameHeight + this.frameYpos + 209, this.frameWidth -6 );
    }

    this.update = function () {
        var colourSwap;
        //if (this.machineRun) {
        if (machinesRunning) {
            if (!this.jobComplete) {     // Added February 27, 2018
                if (this.jobRun) {
                    if (!this.Dn && (this.dwellNow > 0)) {
                        this.dwellNow--;
                    }
                    else if (this.Dn && (this.openNow > 0)) {
                        this.openNow--;
                    }
                    else {
                        if ((this.y > this.bdc) || (this.y < this.tdc)) {
                            this.dy = -this.dy;
                            this.runCount++;
                            //Colour Inversion
                            if (this.runCount % 2) {
                                colourSwap = this.gaugeForeGround;
                                this.gaugeForeGround = this.gaugeBackGround;
                                this.gaugeBackGround = colourSwap;
                                this.openNow = this.openTime;

                                this.cycleEnd = new Date(); //
                                this.lapseTime = ((this.cycleEnd - this.cycleBgn) / 1000);
                                this.cycleBgn = this.cycleEnd;

                                this.cycleData.push(this.lapseTime);
                                if (this.cycleData.length > 500) {
                                    var removeCycle = this.cycleData.shift();
                                    console.log("Removed:  " + removeCycle + "cycleData Length:  " + this.cycleData.length);
                                }
                                //this.cycleData = this.cycleData.length < 100? this.cycleData.push(this.lapseTime) : this.cycleData.shift();
                                //if (this.id == 0) {
                                //    console.log(this.cycleData.length);

                                this.cycleStdDev = arr.standardDeviation(this.cycleData);
                                //console.log(cycleStdDev);
                                //}

                                if ((this.cycleMin === 0) && (this.cycleMax === 0)) {
                                    this.cycleMin = this.lapseTime;
                                    this.cycleMax = this.lapseTime;
                                }
                                this.cycleMin = this.lapseTime >= this.cycleMin ? this.cycleMin : this.lapseTime;
                                this.cycleMax = this.lapseTime <= this.cycleMax ? this.cycleMax : this.lapseTime;

                                ++this.cycleCount;

                                this.cycleAvg = this.cycleCount > 0 ? (((Date.now() - this.jobBgn) / 1000) / this.cycleCount) : 0;
                                this.cycleRng = this.cycleMax - this.cycleMin;

                                // Determine whether part is Good or Bad

                                if ((this.lapseTime > (this.cycleAvg + (this.cycleStdDev * this.sigma))) || this.lapseTime < (this.cycleAvg - (this.cycleStdDev * this.sigma))) {
                                    ++this.jobHold;
                                    this.jobHoldTime += this.lapseTime;
                                }
                                else {
                                    ++this.jobGood;
                                    this.jobGoodTime += this.lapseTime;
                                }


                                //this.runTime = (Date.now() - jobBgn)/1000;
                                //console.log(this.id + " cycleCount:  " + this.cycleCount);
                                //console.log(this.id + " batchCount:  " + this.batchCount);
                                //this.jobRun = (this.cycleCount < this.batchCount);

                                this.jobComplete = (this.jobGood >= this.batchCount);
                                this.jobRun = (this.jobGood < this.batchCount);
                                this.jobEnd = new Date();
                                this.jobTime = ((this.jobEnd - this.jobBgn) / 1000);

                                // If the job is finished, we need to start the downtime

                                if (!this.jobRun) {
                                    this.startDownTime = new Date();
                                }

                                if (this.machineHome) {
                                    console.log(this.id + "Home");
                                    this.machineRun = false;
                                }
                            }
                            this.dwellNow = this.dwellTime;
                        }

                        this.y += this.dy;
                        this.tBolsterY += this.dy;
                        this.tDieShoeY += this.dy;

                        if (this.dy >= 0) {
                            this.travelAngle = Math.PI * (this.y - this.tdc) / this.stroke;
                            this.Dn = true;
                        } else {
                            this.travelAngle = Math.PI * (((this.bdc - this.y) / this.stroke) + 1);
                            this.Dn = false;
                        }

                        // This only updates the time when there's motion!
                        //this.runTime = (Date.now() - this.jobBgn)/1000;

                        /* Interactivity Begins Here!
                        // interactivity begins
                        if (((mouse.x - this.x) < 50) && ((mouse.x - this.x) > -50) && ((mouse.y - this.y) < 50) && ((mouse.y - this.y) > -50)) {
                            if (this.radius < maxRadius) {
                                this.radius += 1;
                            }
                        } else if (this.radius > this.minRadius) {
                            this.radius -= 1;
                        }
                        //*/
                    }
                    // this.runTime = new Date();
                    // this.runTime = (this.runTime - this.startTime) / 1000;
                    //
                    // this.drawRunTime();
                    this.draw();
                } else if (!this.jobComplete) {
                    /*
                    If the job is finished, the machine downtime may continue
                    however, the job downtime counter should stop.
                    */
                    this.cycleDownTime = new Date();
                    this.downTime += (this.cycleDownTime - this.startDownTime) / 1000;
                    this.startDownTime = this.cycleDownTime;
                } // Added February 27, 2018
                this.runTime = new Date();
                this.runTime = (this.runTime - this.startTime) / 1000;
                this.drawRunTime();
            }
        } else
        {
            this.draw();
            this.drawRunTime();
        }
            // this.runTime = new Date();
        // this.runTime = (this.runTime - this.startTime) / 1000;
        // this.drawRunTime();
    }
}

function init (machineName, machineCount, machineStroke, batchSizeMin, batchSizeMax) {

    // machineArray is GLOBAL, no "var" before array name.
    machineArray = [];

    /*
     Considerations for Machine design
        DWELL Time
        Variable Rate
        Rapid Return
        Minimum Stroke
    */
    
    for (var i = 0; i < machineCount; i++) {
        var machineRun = true;
        var startTime = new Date();
        var batchCount = batchSizeMin + Math.floor((Math.random() * (batchSizeMax-batchSizeMin + 1)));
        //var batchCount = 50;
        var id = i;
        var x = (100 * (i + 1) + (100 * i));
        var y = 155;
        var ramWidth = 80;
        var ramHeight = 25;
        var stroke = machineStroke;
        var tDieShoeWidth = 60;
        var tDieShoeHeight = 10;
        var bDieShoeWidth = 60;
        var bDieShoeHeight = 15;
        var materialThickness = 3;
        var rate = Math.floor(1 + (Math.random() * 3));
        var clearance = 2;
        var lhSide = 15;
        var rhSide = 15;
        var upSide = 20;
        var loSide = 40;
        var tBolster = 8;
        var bBolster = 10;
        var dwellTime = i + Math.floor(Math.random() * i * 20);
        var openTime = i + Math.floor(Math.random() * i * 40);
        var shutHeight = tDieShoeHeight + materialThickness + bDieShoeHeight;
        var sigma = 2.25;

        machineArray.push(new PressRam(id, machineName, startTime, batchCount, x, y, ramWidth, ramHeight, stroke, shutHeight, rate, clearance, lhSide, rhSide, upSide, loSide, tBolster, bBolster, tDieShoeHeight, tDieShoeWidth, bDieShoeHeight, bDieShoeWidth, materialThickness, dwellTime, openTime, sigma));
        //console.log(i);
    }
}

var mouse = {
    x: undefined,
    y: undefined,
    button: undefined
}

// https://color.adobe.com/statue-header-color-theme-10440455/edit/?copy=true&base=2&rule=Custom&selected=4&name=Copy%20of%20statue-header&mode=rgb&rgbvalues=0.011764705882352941,0.06666666666666667,0.1568627450980392,0.13725490196078433,0.17647058823529413,0.25098039215686274,0.9529411764705882,0.8901960784313725,0.8,0.7490196078431373,0.6431372549019608,0.5803921568627451,0.4549019607843137,0.3686274509803922,0.3215686274509804&swatchOrder=0,1,2,3,4

var colorArray = [
    '#031128',
    '#232D40',
    '#F3E3CC',
    '#BFA494',
    '#745E52',
];

var colorArray2 = [
    '#A6957B',
    '#FFF9F0',
    '#F3E3CC',
    '#6A8EA6',
    '#CCE3F3',
];

//
window.addEventListener('click', function(event) {
    console.log('event');
    console.log(event);
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.button = event.target.id;
    console.log(mouse);
})

//console.log(machineArray);

function animate() {
    //if (machinesRunning) {
    requestAnimationFrame(animate);
    if (machinesRunning) {
        for (var i = 0; i < machineArray.length; i++) {
            machineArray[i].update();
        }
    }
}

machineReset();
/*var machinesRunning = false;
init(machineName, machineCount, machineStroke, batchSizeMin, batchSizeMax);
for (var i=0; i < machineArray.length; i++)
{
    machineArray[i].update();
}
*/
animate();

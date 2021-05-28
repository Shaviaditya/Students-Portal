let totaltime = document.getElementById('hid1').innerHTML;
const count = document.getElementById('countdown')

setInterval(update,1000);
function update(){
    hours = Math.floor(totaltime/3600);
    minutes = Math.floor(totaltime/60);
    minutes = (Math.floor)(minutes%60)
    seconds = Math.floor(totaltime%60);
    hours = hours<10?('0'+hours):hours;
    minutes = minutes<10?('0'+minutes):minutes;
    seconds = seconds<10?('0'+seconds):seconds;
    if(hours==0 && minutes==0 &&seconds==0)
    {
        alert('Exam over')
        location.replace('http://localhost:5000/Studentportal')
    }
    count.innerHTML = `${hours}:${minutes}:${seconds}`;
    totaltime--
}


function CustomDate(year, month, day, hour, minutes, seconds, mseconds, timeZone) {
    var date = {
        year : year,
        month : month,
        day : day, 
        hour : hour, 
        minutes : minutes, 
        seconds : seconds, 
        mseconds : mseconds, 
        timeZone :timeZone
        
    };
    this.addDay = function(number){
        date.day += number;
    };
    
    this.check = function(){
      // check date   
      return true;
    };

}

var DateHelper = {

    parse : function(str) {
        // some date parsing logic
        return new CustomDate();
    },
    
    format : function(str) {
        // some date formating logic
        return str;
    }
    
};


function MagicDate(date, dateHelper) {
    
    var dh = dateHelper || DateHelper;
    
    var d = dh.parse(date);
    
    this.get_day_of_week = function(){
        return d.format('DDD');
    };
    
    this.addDay = function(number){
        d.addDay(number);
        d.check();
        return d.format('DDD');
    };
    
    this.wait = function(callback){
       setTimeout(callback, 200); 
        
    };
    
}
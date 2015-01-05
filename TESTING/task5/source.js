/*

<div id="my_div"></div>
<input type="text" id="name"/><input id="go" type="submit" value="GO" onclick="sendName(); return false;" />

*/

// problems?
// -  DOM 
// -  Network
// -  Style

function formatMessage(value, text, node) {
    // set node value to fomated text
    node.innerHTML = text.replace('{0}', value);
}

function showResponse(value) {
    var b = document.getElementById('my_div');
    
    if(value == 200) {
        b.innerHTML = 'success';

    } else {
        formatMessage(value, "Server response is: {0}", d);
    }
}

function sendName() {

    var r = new XMLHttpRequest();
    r.open("POST", "somePage", true);
    r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;
      showResponse(r.status);
    };
    r.send();

}

// after refactoring

var SimpleForm = {
  'Model' : function (value, callback){
      
      this.send = function(callback){
        var r = new XMLHttpRequest();
        r.open("POST", "somePage", true);
        r.onreadystatechange = function () {
          if (r.readyState != 4 || r.status != 200) return;
          callback && callback(r.status);
        };
        r.send('name='+ value);
      }
      
  },
  'View' : function(){
      
      function getNodeById(id){
          return document.getElementById(id);
      }
      
      this.getName = function(){
          return getNodeById('name').value;
      };
      
      this.formatMessage = function(value, text){
          return text.replace('{0}', value);
      };
      
      this.updateMessage = function(text) {
          
          getNodeById('my_div').innerHTML = text;
      };
      
      this.showMessage = function(value){
        if(value == 200) {
            this.updateMessage('success');
        } else {
            this.updateMessage(this.formatMessage(value, "Server response is: {0}"));
        }
      };
      
      
      this.init = function(clickCallback){
          this.click = clickCallback;
      }
      
      this.clicked = function(){
          this.click && this.click();
      };
      
      getNodeById('go').onclick = this.clicked;
      
  },
  'Controller' : function (view, model){
      
      var Model = model || new SimpleForm.Model();
      var View = view || new SimpleForm.View();
     
     
      this.clickCallback = function(){
          Model.send(View.getName(), this.modelCallback);
      };
    
      this.modelCallback = function(value){
         View.showMessage(value);
      };
     
      View.init(this.clickCallback);

  }
};





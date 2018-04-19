$(function() {

  const cDice = $("#cdice");

  Dice.init(cDice, getRandName, setName);
})

var name = null;

function getRandName() {
  $.ajax({
    url: "https://randomuser.me/api/?nat=us&inc=name&noinfo",
    dataType: 'json',
    success: function(data) {
      var first = data.results[0].name.first;
      var last  = data.results[0].name.last;

      name = first + " " + last;
    }
  })
}

function setName(){
  const inpName = $("#inp-name");
  inpName.val(name);

}


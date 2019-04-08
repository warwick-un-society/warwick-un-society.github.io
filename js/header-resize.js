$(function()  {
  /* Different styling for index page */
  var loc = window.location.href;
  if(/index/.test(loc)) {
    $(document.body).addClass('index');
    // Remove article wrapping of the title
    $('.post-title').appendTo('.article-wrapper');
    $('article > p').appendTo('.article-wrapper');
    $("article").remove();
  }
  /* Smaller header when scrolling */
  $(window).scroll(function() {
      var scroll = $(window).scrollTop();

      if(scroll >= 200) {
        $("header").addClass("smaller");
      } else  {
        $("header").removeClass("smaller");
      }
    });
});

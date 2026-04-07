!function(i) {
  var o, n;
  i(".title_block").on("click", function() {
    o = i(this).parents(".accordion_item");
    n = o.find(".info");

    if (o.hasClass("active_block")) {
      o.removeClass("active_block");
      n.slideUp();
    } else {
      o.addClass("active_block");
      n.stop(true, true).slideDown();

      o.siblings(".active_block")
        .removeClass("active_block")
        .children(".info")
        .stop(true, true)
        .slideUp();
    }
  });
}(jQuery);
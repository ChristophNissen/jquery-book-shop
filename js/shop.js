// Helper
// https://cmatskas.com/get-url-parameters-using-javascript/
var parseQueryString = function(url) {
  var urlParams = {};
  url.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );
  return urlParams;
}
var urlParams = parseQueryString(location.search);

// Categories
function CategoryManager() {

  this.categories = [];
  this.currentCategory = false;
  this.url = "http://api.origin.berlin/category";
  this.menu = $("#category-menu");

  this.loadCategories = function() {
    var that = this;
    $.getJSON(this.url, function(data) {
      that.categories = data;
      that.addMenuItems();
      that.setCurrentCategory();
    })
    $(document).trigger("category_load");
  }

  this.addMenuItems = function() {
    var that = this;

    $.each(this.categories, function(index, category) {
      var li = $("<li>").addClass("nav-item");
      var a = $("<a>").addClass("nav-link").attr("href", "category.html?catID=" + category.id).text(category.name).appendTo(li);
      that.menu.append(li);
    });
    $(document).trigger("category_menuAdded");
  }

  this.setCurrentCategory = function() {
    var that = this;

    if (!urlParams.catID) return; // break if there is now param in the URL!
    $.each(this.categories, function(index, category) {
      if (category.id == urlParams.catID) {
        that.currentCategory = category;
        $(".category-name").text(category.name);
      }
    });

    $(document).trigger("category_currentSet");
  }

}

var categoryManager = new CategoryManager();
categoryManager.loadCategories();


function BookManager() {

  this.currentBook = false;
  this.url = "http://api.origin.berlin/book";
  this.books = [];
  this.container = $("#book-container");

  this.init = function() {
    var that = this;

    $(document).on("category_currentSet", function() {
      that.addBooks();
    });

    this.loadBooks();
  }

  this.loadBooks = function() {
    var that = this;

    $.getJSON(this.url, function(data) {
      that.books = data;
      that.setCurrentBook();
      that.addBooks();
    });
  }

  this.addBooks = function() {
    var that = this;

    $.each(this.books, function(index, book) {
      if (book.category_id == categoryManager.currentCategory.id || categoryManager.currentCategory == false) {
		var div = $("<div>").addClass("col-3");
        $("<img>").attr("src", book.image).addClass("img-fluid").appendTo(div);
        var p = $("<p>").appendTo(div);
        $("<a>").attr("href", "detail.html?book=" + book.slug).text(book.title).appendTo(p);
        that.container.append(div);
      }
    })
  }

  this.setCurrentBook = function() {
    var that = this;

    if (!urlParams.book) return; // break if there is no param in the URL!

    $.each(this.books, function(index, book) {
      if (book.slug == urlParams.book) {
        that.currentBook = book;
        $(".book-image").attr("src", that.currentBook.image);
        $(".book-title").text(that.currentBook.title);
        $(".book-author").text(that.currentBook.author);
        $(".book-price").text(that.currentBook.price);
        $(".book-year").text(that.currentBook.date);
        $(".book-reviews").text("(" + that.currentBook.reviews + " reviews)");
        $(".book-ratings").text(that.currentBook.rating);
        return;
      }
    });
  }
}

var bookManager = new BookManager();
bookManager.init();






function CartManager() {

  this.cart = [];
  this.checkoutButton = $("#checkoutButton");
  this.container = $("#shoppingCart");
  this.cartButton = $(".cart-amount");

  this.init = function() {
    var that = this;
    that.cart = (localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
    that._updateCartIcon();
    $(".cart-amount").text(this.cart.length);

    $(".add-to-cart").on("click",function(){
      that.addItem( bookManager.currentBook );
    });
    $(".cart-checkout").on("click",function(){
      that.checkout();
    });
    $(".cart-clear").on("click",function(){
      that.clear();
    });
    $(document).on("click",".cart-delete-item", function(){
      that.deleteItem($(this).data("index"));
    });
    that.display();
  }

  this.display = function(){
    var that = this;
    var total = 0;
    that.container.html("");
    $.each(that.cart,function(index,item){
      var row = $("<tr>");
      $("<td>").text(item.id).appendTo(row);
      $("<td>").html( $("<img>").attr("src", item.image )).appendTo(row);
      $("<td>").text(item.title).appendTo(row);
      $("<td>").text(item.author).appendTo(row);
      $("<td>").text(item.price).appendTo(row);
      var closeButton = $("<button>").addClass("btn btn-outline-warning cart-delete-item").html("&times;").attr("data-index", index);
      $("<td>").html(closeButton).appendTo(row);
      that.container.append(row);
      total += item.price;
    });
    $(".cart-total").text(total);
  }

  this.deleteItem = function(itemIndex){
    this.cart.splice(itemIndex,1);
    this._updateStorage();
  } 

  this.addItem = function(item){
    this.cart.push(item);
    this._updateStorage();
    window.location.href = "cart.html";
  }

  this.clear = function(){
    this.cart = [];
    this._updateStorage();
    window.location.href = "index.html";
  }

  this.checkout = function(){
    alert("Thanks!");
    this.clear();
  }

  this._updateStorage = function(){
    localStorage.setItem("cart",JSON.stringify(this.cart));
    this._updateCartIcon();
    this.display();
  }

  this._updateCartIcon = function() {
    this.cartButton.text(this.cart.length);
    this.cartButton.parent().toggleClass("text-success", this.cart.length != 0 )
  }

}

var cartManager = new CartManager();
cartManager.init();

















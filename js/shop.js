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
console.log(urlParams);

// Categories
function CategoryManager(){

	this.categories = [];
	this.currentCategory = false;
	this.url = "http://api.origin.berlin/category";
	this.menu = $("#category-menu");

	this.loadCategories = function(){
		var that = this;
		$.getJSON(this.url,function(data){
			that.categories = data;	
			that.addMenuItems();
			that.getCurrentCategory();
		})
	}

	this.addMenuItems = function(){
		var that = this;

		$.each(this.categories, function(index, category){
            var li = $("<li>").addClass("nav-item");
            var a = $("<a>").addClass("nav-link").attr("href","category.html?catID=" + category.id).text(category.name).appendTo(li);
            that.menu.append(li);
		});
	}

	this.getCurrentCategory = function(){
		var that = this;

		if(!urlParams.catID) return; // break if there is now param in the URL!
		$.each(this.categories, function(index, category){
			if(category.id == urlParams.catID){
				that.currentCategory = category;
				$(".category-name").text(category.name);
			}
		});
	}

}

var categoryManager = new CategoryManager();
categoryManager.loadCategories();


function BookManager(){

	this.currentBook = false;
	this.url = "http://api.origin.berlin/book";
	this.books = [];
	this.container = $("#book-container");

	this.loadBooks = function(){
		var that = this;

		$.getJSON(this.url, function(data){
			that.books = data;
			that.addBooks();
			that.getCurrentBook();
		});
	}

	this.addBooks = function(){
		var that = this;

		$.each(this.books, function(index, book){

  			var div = $("<div>").addClass("col-3");
  			$("<img>").attr("src",book.image).addClass("img-fluid").appendTo(div);
  			var p = $("<p>").appendTo(div);
  			$("<a>").attr("href","detail.html?book="+ book.slug).text(book.title).appendTo(p);

  			that.container.append(div);

		})
	}

	this.getCurrentBook = function(){
		var that = this;

		if(!urlParams.book) return; // break if there is no param in the URL!

		$.each(this.books, function(index, book){
			if(book.slug == urlParams.book){
				that.currentBook = book;
				$(".book-image").attr("src",that.currentBook.image);
				$(".book-title").text(that.currentBook.title);
				$(".book-author").text(that.currentBook.author);
				$(".book-price").text(that.currentBook.price);
				$(".book-year").text(that.currentBook.date);
				$(".book-reviews").text("("+that.currentBook.reviews+" reviews)");
				$(".book-ratings").text(that.currentBook.rating);
			}
		});
	}
}

var bookManager = new BookManager();
bookManager.loadBooks();




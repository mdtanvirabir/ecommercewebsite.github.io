$(document).ready(function(){
	productNamespace.init();
});

(function(){
	this.productNamespace = this.productNamespace || {};
	var ns = this.productNamespace;
	var currentProduct;

	ns.init = function(){
		$('#prImage').on('change', bindImage);
		$('#addBtn').on('click', function(e){
			e.preventDefault();
			ns.save();
		});
		$('#clearBtn').on('click', ns.clearProduct);
		ns.display();
	}
	
	function bindImage(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(evt){
			var result = evt.target.result;
			$('#holdImg').removeAttr('src');
			$('#holdImg').attr('src', result);
		}
	}

	function productRetreive(){
		var allproduct = JSON.parse(localStorage.getItem('product'));
		return allproduct ? allproduct : [];
	}

	ns.display = function (){
		currentProduct = {key:null, product:{}};
		var results = productRetreive();
		bindToGrid(results);		
	}

function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
 
    reader.onload = function(e) {
      var htmlPreview =
        '<img width="200" src="' + e.target.result + '" />' +
        '<p>' + input.files[0].name + '</p>';
      var wrapperZone = $(input).parent();
      var previewZone = $(input).parent().parent().find('.preview-zone');
      var boxZone = $(input).parent().parent().find('.preview-zone').find('.box-body'); 
      wrapperZone.removeClass('dragover');
      previewZone.removeClass('hidden');
      boxZone.empty();
      boxZone.append(htmlPreview);
    }; 
    reader.readAsDataURL(input.files[0]);
  }
} 
$(".dropzone").change(function() {
  readFile(this);
});
 
$('.dropzone-wrapper').on('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).addClass('dragover');
});
 
$('.dropzone-wrapper').on('dragleave', function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).removeClass('dragover');
});



function bindToGrid(results){
		var html='';
		for(var i = 0; i<results.length; i++){
			var product = results[i];
			html +='<tr><td class="displayImg"><img class="img-responsive" src="'+product.image+'"/></td>';
			html +='<td>'+product.productName+'</td>';
			html +='<td>'+product.productDetails+'</td>';
			html +='<td>'+product.productPrice+'</td>';
			html +='<td>'+product.quantity+'</td>';
			html +='<td>'+product.date+'</td>';
			html +='<td>'+product.productAvailability+'</td>';
			html +='<td><a class="edit" href="javascript:void(0)" data-key="'+i+'"><i class="fa fa-edit"></i></a></td>';
			html +='<td><a class="delete" href="javascript:void(0)" data-key="'+i+'"><i class="fa fa-trash"></i></a></td></tr>';
		}
		html = html || '<tr><td colspan="9">No Records Available</td></tr>';
		$('#productTable').html('<table id="productTable" class="table table-responsive table-bordered">' +
							'<tr><th>Photo</th><th>Product Name</th><th>Product Details</th> <th>Product Price</th>'+
								'<th>Quantity</th><th>Added Date</th><th>Availability</th><th>Edit</th><th>Delete</th>' +
							'</tr></table>');
		$('#productTable').append(html);
		$('a.edit').on('click', ns.loadProduct);
		$('a.delete').on('click', ns.deleteProduct);             								
	}

	ns.deleteProduct = function(){
		var key = parseInt($(this).attr('data-key')); 
		var results = productRetreive();
		$.each(results, function(index, obj){
	        results.splice(key,1);
	        localStorage.setItem('product', JSON.stringify(results));
	        ns.display();
	        return false;
		});
	}

	ns.loadProduct = function(){
		var key = parseInt($(this).attr('data-key'));
		var results = productRetreive();
		$('#headStatus, #addBtn').html('Update Product');
		$('.getImg-status').html('change image');
		currentProduct = {key:key, product:results[key]};
		displayCurrentProduct();
	}

	function displayCurrentProduct(){
		var product = currentProduct.product;
		$('#productName').val(product.productName);
		$('#productDetails').val(product.productDetails);
		$('#productPrice').val(product.productPrice);
		$('#category').val(product.category);
		$('#quantity').val(product.quantity);
		$('#date').val(product.date);
		$('#productAvailability').val(product.productAvailability);                                   
		$('#holdImg').attr('src', product.image);
	}

	ns.save = function(){
		var img = new Image();
		var product = currentProduct.product;
		product.productName = $('#productName').val();
		product.productDetails = $('#productDetails').val();
		product.productPrice = $('#productPrice').val();
		product.category = $('#category').val();                         
		product.quantity = $('#quantity').val(); 
		product.date = $('#date').val(); 
		product.productAvailability = $('#productAvailability').val();                               
		img.src = $('#holdImg').attr('src');
		product.image = img.src;

		var results = productRetreive();

		if(currentProduct.key != null){
		    results[currentProduct.key] = product;
            localStorage.setItem('product', JSON.stringify(results));
			clearInput();
			ns.display();
		}
		else {
			if(product.productName && product.productDetails && product.productPrice && product.category && product.quantity && product.date && product.productAvailability){
				results.push(product);
				localStorage.setItem('product', JSON.stringify(results));
				clearInput();
				ns.display();
			}else{
				var html ='';
					html +='<p style="color:red;">Fill required Field(eg. product Name, Product Details, Price, Quantity etc.)</p>';
				$('.productAddBox').append(html);
			}			
		}		
	}

	function clearInput(){
		$('#productName').val(''); 
		$('#productDetails').val('');
		$('#productPrice').val('');
		$('#category').val('');
		$('#quantity').val('');
		$('#date').val('');
		$('#productAvailability').val('');
		$('#PsEmail').val('');
		$('#holdImg').attr('src','images/placeholder.png');                 
	}

	ns.clearProduct = function(){
		if(localStorage.length != 0){
			localStorage.clear();
			$("#productTable").find("tr:gt(0)").remove();
			ns.display();
		}
	}
})();
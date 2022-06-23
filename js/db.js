window.onload = function() {
  const DBOpenRequest = window.indexedDB.open("Florist", 1);
  
  DBOpenRequest.onerror = function(event) {
    console.log('Error loading database.');
  };

  DBOpenRequest.onsuccess = function(event) {
	    console.log('Database initialised.');
	
	    // store the result of opening the database in the db variable. This is used a lot below
	    db = DBOpenRequest.result;
	
	    insertFlower(db, {
	      name: 'lala',
	      quantity: 500,
	      price: 181
		 });
		
		  insertFlower(db, {
		   name: 'karanfil',
		   quantity: 800,
		   price: 405
		  });
		
		insertFlower(db, {
		 name: 'ruža',
		 quantity: 300,
		 price: 302
		});
		
		insertFlower(db, {
		name: 'gerber',
		quantity: 500,
		price: 103
		});
		
		insertFlower(db, {
		name: 'ljiljan',
		quantity: 200,
		price: 209
		});
		
		insertFlower(db, {
		name: 'kaktus',
		quantity: 50,
		price: 304
		});

    // Run the displayData() function to populate the florist with all data already in the IDB
    displayData();
  };

  // This event handles the event whereby a new version of the database needs to be created
  // Either one has not been created before, or a new version number has been submitted via the
  // window.indexedDB.open line above
  //it is only implemented in recent browsers
  DBOpenRequest.onupgradeneeded = function(event) {
    let db = event.target.result;

    db.onerror = function(event) {
      console.log('Error loading database.');
    };

    // Create an objectStore for this database

    let objectStore = db.createObjectStore("Flowers", { keyPath: "name" });

    // define what data items the objectStore will contain

    objectStore.createIndex("price", "price", { unique: false });
    objectStore.createIndex("quantity", "quantity", { unique: false });
    
    console.log('Object store created.');
  };

  function insertFlower(db, flower) {
    // create a new transaction
    const txn = db.transaction('Flowers', 'readwrite');

    // get the Flowers object store
    const store = txn.objectStore('Flowers');
    //
    let query = store.put(flower);

    // handle success case
    query.onsuccess = function (event) {
      console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
      console.log(event.target.errorCode);
    }

    // close the database once the 
    // transaction completes
    txn.oncomplete = function () {
      db.close();
    };
  }

  function displayData() {

    // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
    let objectStore = db.transaction('Flowers').objectStore('Flowers');
    objectStore.openCursor().onsuccess = function(event) {
      let cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if(cursor) {
          let ztabela=document.getElementById('ztabela');
          const flowerName = cursor.value.name;
          const flowerPrice = cursor.value.price;
          const flowerQuantity = cursor.value.quantity;

          let tr = document.createElement('tr');
          ztabela.appendChild(tr); 
          let td1 = document.createElement('td');  
          let img = document.createElement('img');
          img.setAttribute('src','img/'+flowerName+'.png');
          img.setAttribute('alt',flowerName);
          img.setAttribute('height','100');
          td1.innerHTML = capitalize(flowerName) + "  ";
          td1.appendChild(img);
          tr.appendChild(td1);     
          
          let td2 = document.createElement('td'); 
          let input2 = document.createElement('input');
          let label2 = document.createElement('label');
          label2.setAttribute('for', flowerName+'-kol');
          label2.innerHTML = 'Količina: &nbsp; &nbsp;';
          Object.assign(input2, {
            className: 'form-control',
            type:'number',
            id: flowerName+'-kol',
            name: flowerName+'-kol',
            value: 0, 
            min: 0,
            max: flowerQuantity,
            onchange: function () {
              osveziCenu(flowerName+'-kol',flowerName+'-kom',flowerName+'-ukcena');
            }
          });    
          td2.appendChild(label2);   
          td2.appendChild(input2); 
          tr.appendChild(td2); 
    
          let td3 = document.createElement('td'); 
          tr.appendChild(td3); 
          td3.innerHTML='<label for="'+flowerName+'-ukcena">Ukupna cena:</label> <input type="text" id="'+flowerName+'-ukcena" name="'+flowerName+'-ukcena" class="form-control" value=0>';  
    
          let td4 = document.createElement('td');   
          td4.innerHTML = ' <label for="'+flowerName+'-kom">Po komadu:</label> <input type="text" id="'+flowerName+'-kom" name="'+flowerName+'-kom" class="form-control  disabled" value="'+flowerPrice+'"  disabled> dinara';
          tr.appendChild(td4);                
    
          // continue on to the next item in the cursor
          cursor.continue();

        // if there are no more cursor items to iterate through, say so, and exit the function
        } else {
          console.log('Entries all displayed.');
        }
      }
    }

  function capitalize(s){
    return s[0].toUpperCase() + s.slice(1);
  }
}
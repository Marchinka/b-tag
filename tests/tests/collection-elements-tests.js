(function(currentDocument) {

	b.tag.registerElement("not-valid-test-template", {});

	b.tag.registerElement("test-template", {
		renderFrom: function (item) {
			this.innerHTML = item.name;
		}
	});

	describe("<collection-elements>", function() {
		describe("appendData method", function () {
			describe("without a defined template", function () {
			    it("adds object to dataSource property", function() {
					// SETUP
					var element = testHelpers.createElement("collection-elements");
					var obj1 = { id: 1, name: "Blondie" };
					var obj2 = { id: 2, name: "The Rat" };
					var obj3 = { id: 3, name: "Angel Eyes" };
					var inputList = [ obj1, obj2, obj3 ];

					// EXERCISE
					element.appendData(inputList);

					// ASSERT
					expect(element.dataSource.length).to.equal(3);
				});

			    it("renders objects serialization", function() {
					// SETUP
					var element = testHelpers.createElement("collection-elements");
					var obj1 = { id: 1, name: "Blondie" };
					var obj2 = { id: 2, name: "The Rat" };
					var obj3 = { id: 3, name: "Angel Eyes" };
					var inputList = [ obj1, obj2, obj3 ];

					// EXERCISE
					element.appendData(inputList);

					// ASSERT
					var innerElements = element.querySelectorAll("p");
					expect(innerElements[0].textContent).to.equal(JSON.stringify(obj1));
					expect(innerElements[1].textContent).to.equal(JSON.stringify(obj2));
					expect(innerElements[2].textContent).to.equal(JSON.stringify(obj3));
				});				
			});
		});

		describe("with a not valid template defined in template attribute", function () {
		    it("adds object to dataSource property", function() {
				// SETUP
				var element = testHelpers.createElement("collection-elements", {
					template: "not-valid-test-template"
				});
				var obj1 = { id: 1, name: "Blondie" };
				var obj2 = { id: 2, name: "The Rat" };
				var obj3 = { id: 3, name: "Angel Eyes" };
				var inputList = [ obj1, obj2, obj3 ];

				// EXERCISE
				element.appendData(inputList);

				// ASSERT
				expect(element.dataSource.length).to.equal(0);
			});

		    it("renders objects in template", function() {
				// SETUP
				var element = testHelpers.createElement("collection-elements", {
					template: "not-valid-test-template"
				});
				var obj1 = { id: 1, name: "Blondie" };
				var obj2 = { id: 2, name: "The Rat" };
				var obj3 = { id: 3, name: "Angel Eyes" };
				var inputList = [ obj1, obj2, obj3 ];

				// EXERCISE
				element.appendData(inputList);

				// ASSERT
				var innerElements = element.querySelectorAll("not-valid-test-template");
				expect(innerElements.length).to.equal(0);
			});				
		});

		describe("with a valid template defined in template attribute", function () {
		    it("adds object to dataSource property", function() {
				// SETUP
				var element = testHelpers.createElement("collection-elements", {
					template: "test-template"
				});
				var obj1 = { id: 1, name: "Blondie" };
				var obj2 = { id: 2, name: "The Rat" };
				var obj3 = { id: 3, name: "Angel Eyes" };
				var inputList = [ obj1, obj2, obj3 ];

				// EXERCISE
				element.appendData(inputList);

				// ASSERT
				expect(element.dataSource.length).to.equal(3);
			});

		    it("renders objects in template", function() {
				// SETUP
				var element = testHelpers.createElement("collection-elements", {
					template: "test-template"
				});
				var obj1 = { id: 1, name: "Blondie" };
				var obj2 = { id: 2, name: "The Rat" };
				var obj3 = { id: 3, name: "Angel Eyes" };
				var inputList = [ obj1, obj2, obj3 ];

				// EXERCISE
				element.appendData(inputList);

				// ASSERT
				var innerElements = element.querySelectorAll("test-template");
				expect(innerElements[0].textContent).to.equal(obj1.name);
				expect(innerElements[1].textContent).to.equal(obj2.name);
				expect(innerElements[2].textContent).to.equal(obj3.name);
			});				
		});

		describe("clearData method", function () {
		    it("removes all objects", function() {
				// SETUP
				var element = testHelpers.createElement("collection-elements");
				var obj1 = { id: 1, name: "Blondie" };
				var obj2 = { id: 2, name: "The Rat" };
				var obj3 = { id: 3, name: "Angel Eyes" };
				var inputList = [ obj1, obj2, obj3 ];
				element.appendData(inputList);

				// EXERCISE
				element.clearData();

				// ASSERT
				expect(element.dataSource.length).to.equal(0);
			});

		    it("removes objects serialization", function() {
				// SETUP
				var element = testHelpers.createElement("collection-elements");
				var obj1 = { id: 1, name: "Blondie" };
				var obj2 = { id: 2, name: "The Rat" };
				var obj3 = { id: 3, name: "Angel Eyes" };
				var inputList = [ obj1, obj2, obj3 ];
				element.appendData(inputList);

				// EXERCISE
				element.clearData();

				// ASSERT
				var innerElements = element.querySelectorAll("p");
				expect(innerElements.length).to.equal(0);
			});				
		});
	});
})(document);
(function() {
      // Before using it we must add the parse and format functions
      // Here is a sample implementation using moment.js
      validate.extend(validate.validators.datetime, {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: function(value, options) {
          return +moment.utc(value);
        },
        // Input is a unix timestamp
        format: function(value, options) {
          var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
          return moment.utc(value).format(format);
        }
      });

      // These are the constraints used to validate the form
      var constraints = {
		  vehicle_type: {
          // You also need to input where you live
          presence: true,
          // And we restrict the countries supported to Sweden
          exclusion: {
            within: ["NULL"],
            // The ^ prevents the field name from being prepended to the error
            message: "^Select Type"
          }
        },
        vehicle_id: {
          presence: true,
		  format: {
				  pattern: /^[(TR|BS)]{2}\d{3}$/,
				  message: function(value, attribute, validatorOptions, attributes, globalOptions) {
					return validate.format("^%{num} is not a valid ID ( should be in BSXXX or TRXXX format)", {
					  num: value
					});
					}
				}
        },
		station: {
          // You also need to input where you live
          presence: true,
          // And we restrict the countries supported to Sweden
          exclusion: {
            within: ["NULL"],
            // The ^ prevents the field name from being prepended to the error
            message: "^Select one station"
          }
        }
	};

      // Hook up the form so we can prevent it from being posted
      var form = document.querySelector("form#form_spotvehicle");
      form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        handleFormSubmit(form);
      });

      // Hook up the inputs to validate on the fly
      var inputs = document.querySelectorAll("input, select")
      for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("blur", function(ev) {
          var errors = validate(form, constraints) || {};
          showErrorsForInput(this, errors[this.name])
        });
      }

      function handleFormSubmit(form, input) {
        // validate the form aainst the constraints
        var errors = validate(form, constraints);
		// then we update the form to reflect the results
        //showErrors(form,errors || {});
		
        if (!errors) {
          showSuccess();
        }
      }

      // Updates the inputs with the validation errors
      function showErrors(form, errors) {
        // We loop through all the inputs and show the errors for that input
        _.each(form.querySelectorAll("input[name], select[name]"), function(input) {
          // Since the errors can be null if no errors were found we need to handle
          // that
          showErrorsForInput(input, errors && errors[input.name]);
        });
      }

      // Shows the errors for a specific input
      function showErrorsForInput(input, errors) {
        // This is the root of the input
        var formGroup = closestParent(input.parentNode, "form-group")
          // Find where the error messages will be insert into
          , messages = formGroup.querySelector(".messages");
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
          // we first mark the group has having errors
          formGroup.classList.add("has-error");
          // then we append all the errors
          _.each(errors, function(error) {
            addError(messages, error);
          });
        } else {
          // otherwise we simply mark it as success
          formGroup.classList.add("has-success");
        }
      }

      // Recusively finds the closest parent that has the specified class
      function closestParent(child, className) {
        if (!child || child == document) {
          return null;
        }
        if (child.classList.contains(className)) {
          return child;
        } else {
          return closestParent(child.parentNode, className);
        }
      }

      function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        // and remove any old messages
        _.each(formGroup.querySelectorAll(".help-block"), function(el) {
          el.parentNode.removeChild(el);
        });
      }

      // Adds the specified error with the following markup
      // <p class="help-block error">[message]</p>
      function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.innerText = error;
        messages.appendChild(block);
      }

      function showSuccess() {
        alert("Success!");
      }
	  
	 ///SET onChange Listener to vehicle_id input////////
	 $("#vehicle_id" ).change(function () {
    var str = $(this).val();
	
	
		if(str.startsWith("BS"))
		{
			$('#vehicle_type option[value=BS]').attr('selected','selected');
			alert("Bus Type");
		}
		else if(str.startsWith("TR"))
		{
			$('#vehicle_type option[value=TR]').attr('selected','selected');
			//$("vehicle_type select").val("TR");
			alert("Train Type");
		}
	
	}).change();
    ////////////////////////////////////////////
	
	})();
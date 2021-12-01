exports.getDate =  function() {

    const today = new Date();

    const options = {
      weekday:"long",
      day:"numeric",
      month:"long",
    };

    // var day = today.toLocalDateString("en-US", options);
    return today.toLocaleDateString("en-US",options);


  }

  exports.getDay = function() {

      const today = new Date();

      const options = {
        weekday:"long",

      };

      // var day = today.toLocalDateString("en-US", options);
      return today.toLocaleDateString("en-US",options);

    }

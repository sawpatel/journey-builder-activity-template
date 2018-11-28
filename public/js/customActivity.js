define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
			
			var options = { 
				method: 'POST',
				url: 'https://promotionsapi.safelite.com/api/v1/generatecode/?SawTest=Yes',
				headers: { 
					'Content-Type': 'application/json',
					'X-Safelite-Secret': 'B4443D1B-BE68-4B71-B306-6AB180DB58DF',
					'X-Safelite-Key': 'A51C73DF-284A-48AF-93DA-117370FAB25B' 
				},
				
				body: { 
					CampaignName: 'BRYAN_TEST',
					Username: 'us\\Sawan.Patel (MC)'
				},
				
				json: true 
			}

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				console.log(body);
			})
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
				postPromoCode();
				console.log("inArgument: " + inArgument + " key: "	+ key + " val: " + val);
              
            });
        });

		connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "emailAddress": "sawan.patel@safelite.com"
        }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }

	function postPromoCode() {

		var options = { 
			method: 'POST',
			url: 'https://promotionsapi.safelite.com/api/v1/generatecode/?SawTest=Yes',
			headers: { 
				'Content-Type': 'application/json',
				'X-Safelite-Secret': 'B4443D1B-BE68-4B71-B306-6AB180DB58DF',
				'X-Safelite-Key': 'A51C73DF-284A-48AF-93DA-117370FAB25B' 
			},
			
			body: { 
				CampaignName: 'BRYAN_TEST',
				Username: 'us\\Sawan.Patel (MC)'
			},
			
			json: true 
		}

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		})
	}

});
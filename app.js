var jQT = $.jQTouch();

$(document).ready(function() {
    console.log($.couch);
    $('#button-add').click(function() {
        jQT.goTo('#add', 'flip');
    });
    
    $('#add').bind('pageAnimationStart', function(event, info) {
        if (info.direction == 'in') {
            navigator.geolocation.getCurrentPosition(function(position) {
                $('#latitude').val(position.coords.latitude);
                $('#longitude').val(position.coords.longitude);
            });
        }
    });
    
    $('#add-submit').click(function(event) {
        event.preventDefault();
        if ($('#animal').val()) {
            // db.transaction(function(transaction) {
            //     transaction.executeSql(
            //         'INSERT INTO sighting ' +
            //         '   (animal, color, datetime, latitude, longitude) ' +
            //         'VALUES ' +
            //         '   (?,?,DATETIME("now"),?,?)'
            //     , [$('#animal').val(), $('#color').val(), $('#latitude').val(), $('#longitude').val()], function(transaction, result) {
            //         updateSightings();
            //         jQT.goBack();
            //         $('#animal,#color,#latitude,#longitude').val('');
            //     }, function(transaction, error) {
            //         alert('Oops. Error was "' + error.message + '" (Code: ' + error.code + ')');
            //         return true;
            //     });
            // });
        }
    });
    
    updateSightings();
});

function updateSightings() {
    $('#sightings li').remove();
    $('#sightings').append('<li>Loading sightings …</li>');
    // db.transaction(function(transaction) {
    //     transaction.executeSql('SELECT * FROM sighting ORDER BY datetime DESC;', null, function(transaction, result) {
    //         $('#sightings li').remove();
    //         if (result.rows.length > 0) {
    //             for (var i=0; i<result.rows.length; i++) {
    //                 var row = result.rows.item(i);
    //                 $('#sightings').append('<li class="arrow"><a href="http://maps.google.com/maps?q=' + encodeURI(row.animal) + '%40' + row.latitude + ',' + row.longitude + '">' + row.animal + ' (' + row.color + ')<div class="datetime">' + row.datetime + '</div></a></li>');
    //             }
    //         } else {
    //             $('#sightings').append('<li>No sightings yet.</li>');
    //         }
    //     });
    // });
    
}
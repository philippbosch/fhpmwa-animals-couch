var jQT = $.jQTouch();

// Verbindung zur Datenbank herstellen.
var db = $.couch.db('animals');

$(document).ready(function() {
    // Beim Antippen des Buttons oben rechts, Add-Panel einblenden
    $('#button-add').click(function() {
        jQT.goTo('#add', 'flip');
    });
    
    // Geoposition kontinuierlich bestimmen und auf dem Add-Panel eintragen
    navigator.geolocation.watchPosition(function(position) {
        $('#latitude').val(position.coords.latitude);
        $('#longitude').val(position.coords.longitude);
    });
    
    // Beim Abschicken des Add-Formulars …
    $('#add-submit').click(function(event) {
        event.preventDefault();
        
        // … und zwar nur, wenn auch ein Wert im Feld "animal" eingetragen wurde, …
        if ($('#animal').val()) {
            // … Sichtungs-Objekt mit entsprechenden Eigenschaften erstellen …
            var sighting = {
                'animal': $('#animal').val(),
                'color': $('#color').val(),
                'datetime': (new Date()).toISOString(),
                'latitude': $('#latitude').val(),
                'longitude': $('#longitude').val()
            };
            // … und dieses in der Datenbank speichern.
            db.saveDoc(sighting, {
                // Bei Erfolg die Liste der Sichtungen aktualisieren, zum Home-Panel zurück kehren und die Felder des Add-Panels leeren.
                'success': function(data) {
                    updateSightings();
                    jQT.goBack();
                    $('#animal,#color,#latitude,#longitude').val('');
                },
                // Und wenn ein Fehler auftritt, diesen anzeigen.
                'error': function(xhr, status) {
                    alert('Oops. Error was "' + status + '"');
                }
            });
        }
    });
    
    updateSightings();
});

function updateSightings() {
    // Die Liste erstmal leeren.
    $('#sightings li').remove();
    
    // Vorübergehend eine Loading-Message einfügen.
    $('#sightings').append('<li>Loading sightings …</li>');
    
    // Alle Sichtungen aus der Datenbank abrufen …
    db.view('animals/ordered_by_datetime', {
        // … und bei Erfolg …
        'success': function(result) {
            // … die Loading-Message entfernen …
            $('#sightings li').remove();
            
            // … und wenn mehr als null Datensätze vorhanden sind …
            if (result.total_rows > 0) {
                // … diese einen nach dem anderen durchgehen …
                for (var i in result.rows) {
                    // … und die Detaildaten abrufen …
                    db.openDoc(result.rows[i].id, {
                        'success': function(row) {
                            // … und ein Listenelemenet erzeugen und einfügen.
                            $('#sightings').append('<li class="arrow"><a href="http://maps.google.com/maps?q=' + encodeURI(row.animal) + '%40' + row.latitude + ',' + row.longitude + '">' + row.animal + ' (' + row.color + ')<div class="datetime">' + row.datetime + '</div></a></li>');
                        }
                    });
                }
            } else {
                // … wenn keine Datensätze vorhanden sind, entsprechende Nachricht einblenden.
                $('#sightings').append('<li>No sightings yet.</li>');
            }
        }
    });
}

if (!Date.prototype.toISOString) {
    function padzero(n) {
        return n < 10 ? '0' + n : n;
    }
    function pad2zeros(n) {
        if (n < 100) {
            n = '0' + n;
        }
        if (n < 10) {
            n = '0' + n;
        }
        return n;     
    }
    function toISOString() {
        return this.getUTCFullYear() + '-' +  padzero(this.getUTCMonth() + 1) + '-' + padzero(this.getUTCDate()) + 'T' + padzero(this.getUTCHours()) + ':' +  padzero(this.getUTCMinutes()) + ':' + padzero(this.getUTCSeconds()) + '.' + pad2zeros(this.getUTCMilliseconds()) + 'Z';
    }
    function fnToISO() {
        var now = new Date();
        alert(toISOString(now));
    }
    Date.prototype.toISOString = toISOString;
}

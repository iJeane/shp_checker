$(document).ready(function () {
    window.addEventListener("load", () => {
        const loader = document.querySelector(".loader");
      
        loader.classList.add("loader--hidden");
      
        loader.addEventListener("transitionend", () => {
          document.body.removeChild(loader);
        });
    });
    $.getJSON( "ea_list.json", function( json ) {
        let municipality = json.province[0].municipality;
        var dataset = [], data = [];
        for(var m=0; m < municipality.length; m++){
            mun_name = municipality[m].name,
            mun_code = municipality[m].code;
            $('div.container-fluid').append(`
                    <h2 class="trj-b mt-3">`+mun_name+` (`+mun_code+`)</h2>
                    <table class="table table-bordered table-striped table-sm table-middle word-wrap text-center" id="`+mun_name+`"></table>
            `);
            for(var x=0; x < municipality[m].barangays.length; x++){
                var name = municipality[m].barangays[x].name,
                    fund = municipality[m].barangays[x].fund, code;
                    if(fund == "PSA") fund = '<span class="text-success">'+fund+'</span>';
                    else fund = '<span class="text-primary">'+fund+'</span>';
                for(var y=0; y < municipality[m].barangays[x].ea.length; y++){
                    code = municipality[m].barangays[x].code+municipality[m].barangays[x].ea[y];
                    data.push(name,code,fund);
                    $.ajax({
                        type: "GET",
                        url: "https://cbms.psa.gov.ph/api/check_shapefiles/CAPI/HPQ"+code,
                        async: false,
                        success: function(result) {
                            if(result == "False") data.push('<span class="badge text-bg-danger">Not Uploaded</span>');
                            else data.push('<span class="badge text-bg-success">Uploaded</span>');
                        }
                    });
                    dataset.push(data);
                    data = [];
                }
            }
            $('table#'+municipality[m].name).DataTable({
                responsive: true,
                columns: [
                    { title: 'Barangay'},
                    { title: 'Geocode'},
                    { title: 'Funding Agency'},
                    { title: 'Shapefile Status'}
                ],
                data: dataset
            });
            data = [], dataset = [];
        }
    });
});
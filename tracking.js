$(function() {
    function getCurrentTimeUTC() {
        var now = new Date();
        var time = now.getTime();
        return time;
    }
    var baseURL = 'https://uploads-ssl.webflow.com/6406d207c344652047f5f291/';
    const iconLinks = {
      'SHIPMENT_UNDER_CREATION' : baseURL + '6423ff5e24c4cfa9294f542e_tracking-tick-icon.svg',
      'SHIPMENT_CREATED' : baseURL + '6423ff5e24c4cfa9294f542e_tracking-tick-icon.svg',
      'SHIPMENT_DOCS_UPLOADED' : baseURL + '64240ce88cad8375f1970dfd_timeline-tag-icon.svg',
      'SHIPMENT_PAYMENT_COMPLETED' : baseURL + '64240c7622ab3596be4148b4_timeline-badge-icon.svg',
      'SHIPMENT_READY_FOR_PICKUP' : baseURL + '6423f97e11e0cd5b58e9e643_shipping-cart-icon.svg',
      'SHIPMENT_OUT_FOR_PICKUP' : baseURL + '64240d496b45791acada5858_timeline-truck-icon.svg',
      'SHIPMENT_PICKUP_FAILED' : baseURL + '6423f97e11e0cd5b58e9e643_shipping-cart-icon.svg',
      'SHIPMENT_PICKUP_SUCCESSFUL' : baseURL + '6423f97e11e0cd5b58e9e643_shipping-cart-icon.svg',
      'SHIPMENT_RECIEVED_AT_PICKUP_LOCATION' : baseURL + '6423f97e11e0cd5b58e9e643_shipping-cart-icon.svg',
      'SHIPMENT_ACCEPTED_AT_PICKUP_LOCATION' : baseURL + '6423f97e11e0cd5b58e9e643_shipping-cart-icon.svg',
      'SHIPMENT_CONNECTED_TO_HUB' : baseURL + '6423f992fd6a5d420c344a5c_shipping-flight-icon.svg',
      'SHIPMENT_RECIEVED_AT_HUB' : baseURL + '6423f992fd6a5d420c344a5c_shipping-flight-icon.svg',
      'SHIPMENT_ACCEPTED_AT_HUB' : baseURL + '6423f992fd6a5d420c344a5c_shipping-flight-icon.svg',
      'SHIPMENT_DOCS_UPLOADED' : baseURL + '64240c7622ab3596be4148b4_timeline-badge-icon.svg',
      'SHIPMENT_LASTMILE_LABEL_GENERATED' : baseURL + '64240ce88cad8375f1970dfd_timeline-tag-icon.svg',
      'SHIPMENT_AT_ORIGIN_CUSTOMS' : baseURL + '64240cfb57241403f8603b1e_timeline-flight-on-board-icon.svg',
      'SHIPMENT_CLEARED_AT_ORIGIN_CUSTOMS' : baseURL + '64240cfb57241403f8603b1e_timeline-flight-on-board-icon.svg',
      'SHIPMENT_RECIEVED_AT_LAST_MILE_HUB' : baseURL + '64240cfb57241403f8603b1e_timeline-flight-on-board-icon.svg',
      'SHIPMENT_DELIVERED' : baseURL + '6423f9b8de83370c19f77155_shipping-double-tick-icon.svg',
    };
    const progressPercent = {
      'SHIPMENT_UNDER_CREATION' : 0,
      'SHIPMENT_PAYMENT_COMPLETED' : 15,
      'SHIPMENT_PICKUP_SUCCESSFUL' : 38,
      'SHIPMENT_OUT_FOR_PICKUP' : 40,
      'SHIPMENT_CONNECTED_TO_HUB' : 50,
      'SHIPMENT_ACCEPTED_AT_HUB' : 62,
      'SHIPMENT_AT_ORIGIN_CUSTOMS' : 86,
      'SHIPMENT_DELIVERED' : 100,
    };
    const progressText = {
      'SHIPMENT_UNDER_CREATION' : 'Under Creation',
      'SHIPMENT_PAYMENT_COMPLETED' : 'Confirmed',
      'SHIPMENT_PICKUP_SUCCESSFUL' : 'Picked',
      'SHIPMENT_OUT_FOR_PICKUP' : 'Out for pickup',
      'SHIPMENT_CONNECTED_TO_HUB' : 'In Transit',
      'SHIPMENT_ACCEPTED_AT_HUB' : 'In Transit',
      'SHIPMENT_AT_ORIGIN_CUSTOMS' : 'Out for delivery',
      'SHIPMENT_DELIVERED' : 'Delivered',
    };
    $('.tracking-btn').on('click', function(e){
    e.preventDefault();
    $(this).val('Loading...');
    var trackingID = $('#Tracking-Field-ID').val();
    if(trackingID && trackingID.length > 0) {
    $.ajax({
        url: `https://app.xindus.net/partner-service/oapi/v1/order/order-tracking?awb=${trackingID}&callback=trackingCallback`,
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'trackingCallback',
        success: function(response) {
            let sourceCountry                   = response.sourceCountry;
            let sourceState                     = response.sourceState;
            let destinationCountry              = response.destinationCountry;
            let estimatedDeliveryDate           = response.estimatedDeliveryDate;
            let trackingURL                     = response.trackingURL;
            let etaMessage                      = response.etaMessage;
            var shipmentData                    = response.data.reverse();
            var latestshipmentDate              = shipmentData.slice(-1)[0].created_on;
            var shipmentStatus                  = shipmentData.slice(-1)[0].status;
              shipmentStatus                    = shipmentStatus.replace(/_/g, ' ');
              shipmentStatus                    = shipmentStatus.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
            $('.shipping-from').text(sourceState + ', ' + sourceCountry);
            $('.shipping-to').text(destinationCountry);
            var newDateOptions2     = {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                }                        
            var newDateOptions3     = {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour12: true,
                }                        
            var latestDateStr = new Date(getCurrentTimeUTC());
            var estimateDateStr = new Date(estimatedDeliveryDate);
            var message_status = ''; 
            if(estimatedDeliveryDate >= getCurrentTimeUTC()) {
                message_status = 'on-time';
            } else {
                message_status = 'delay';
            }
            if(message_status == 'delay') {
                $('.tracking-status-wrap').removeClass('on-time').addClass('on-delay');
                $('.on-time-wrapper').addClass('hidden');
                $('.on-delay-wrapper').removeClass('hidden');
            }
            if(message_status == 'on-time') {
                $('.tracking-status-wrap').removeClass('on-delay').addClass('on-time');
                $('.on-time-wrapper').removeClass('hidden');
                $('.on-delay-wrapper').addClass('hidden');
                $('.delivery-time').text(estimateDateStr.toLocaleString('en-GB', newDateOptions3));
            }
            htmlMarkup = '';
            $.each(response.data.reverse(), function(i, data) {
              var status    = data.status.replace(/_/g, ' ');
              status        = status.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());                 
              var description   = data.description.replace(/_/g, ' ');
              if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(description)) {
                  descriptionSplit  = description.split(' ');
                  descriptionURL    = descriptionSplit.pop();
                  descriptionURLWithTag = ' <a target="download" href="'+ descriptionURL +'">Download</a>';
                  descriptionText = descriptionSplit.join(' ');
                  description = descriptionText + descriptionURLWithTag;
                }
                var date = new Date(data.created_on);
                var newDateOptions  = {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                }
                if(data.currentCity.length > 0 || data.currentState.length > 0 || data.currentCountry.length > 0) {
                    var dataCity;
                    var dataState;
                    var dataCountry;
                    if(data.currentCity.length > 0) {
                        dataCity = data.currentCity + ', ';
                    } else {
                        dataCity = '';
                    }
                    if(data.currentState.length > 0) {
                        dataState = data.currentState + ', ';
                    } else {
                        dataState = '';
                    }
                    if(data.currentCountry.length > 0) {
                        dataCountry = data.currentCountry;
                    } else {
                        dataCountry = '';
                    }                    
                    currentLocation = `<p class="tracking-timeline-details-text">${dataCity}${dataState}${dataCountry}<br/></p>`;
                } else {
                    currentLocation = '';
                }
                htmlMarkup += `
                    <div id="itemid-${data.itemid}" class="w-layout-grid tracking-timeline-grid itemid-${data.itemid} ${data.status}" data-item-id="${data.itemid}">
                        <div class="tracking-timeline-item">
                            <h2 class="tracking-timeline-side-title">${status}</h2>
                        </div>
                        <div class="tracking-timeline-progress-wrap">
                            <div class="tracking-timeline-shade-circle">
                                <div class="tracking-timeline-blue-circle">
                                    <img src="${iconLinks[data.status]}">
                                </div>
                            </div>
                            <div class="tracking-timeline-line"></div>
                        </div>
                        <div class="tracking-timeline-details-wrap">
                            <p class="tracking-timeline-details-text">${description}<br/></p>
                            <p class="tracking-timeline-details-text">${date.toLocaleString('en-GB', newDateOptions)}<br/></p>
                            ${currentLocation}
                        </div>
                    </div>`;
                $('.shipping-timeline-green-line').css('width', progressPercent[data.status] + '%')
            });
            $('#shipment-data-fallback').html(htmlMarkup);
            $('.tracking-timeline-wrap').show();
        $('.tracking-details-wrap').show();
        $('.tracking-id-number').text(trackingID);
        if (trackingURL) {
          $('.current-location-link').attr("href", trackingURL);
        } else {
          $('.current-location-link').hide();
        }
            $('.tracking-btn').val('TRACK');
            $('.status').text(shipmentStatus)
        },
        error: function(xhr, status, error) {
            $('.tracking-form-fail').show(); $('.tracking-btn').val('TRACK')
        }
    });
    }
    })
    });
    $(function(){
      printout("#printing-wrap", {
        pageTitle: window.document.title,
        importCSS: true,
        inlineStyle: true,
        autoPrint: true,
        autoPrintDelay: 1000,
        header: '',
        footer: '',
        noPrintClass: "no-print",
      });        
    });
    window.onload = function() {
        var anchors = document.getElementsByTagName('*');
        for(var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            anchor.onclick = function() {
                code = this.getAttribute('whenClicked');
                eval(code);   
            }
        }
    }
    $(document).ready(function() {
    var awbValue = getUrlParameter('awb');
    if (awbValue !== null) {
      var newUrl = '/tracking?awb=' + awbValue;
      $('#Tracking-Field-ID').val(awbValue);
      $('.tracking-btn').trigger('click');
    }
    $('#Tracking-Field-ID').on('keyup', function(e) {
      if (e.key === 'Enter') {
        $('.tracking-btn').trigger('click');
      }
    });
    });
    function getUrlParameter(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
    }
    $(function() {
    $('form').submit(function(event) {
      event.preventDefault();
      grecaptcha.execute();
      grecaptcha.ready(function() {
        grecaptcha.execute('6LeRenckAAAAAEWscnm_5-2leSa3pwSIH0rOsZui', {action: 'submit'}).then(function(token) {
          $('form').append('<input type="hidden" name="token" value="' + token + '">');
          $('form').unbind('submit').submit();
        });
      });
    });
    });

jQuery(document).ready(function($) {
  var colors = ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#581845', '#FF00FF', '#00FFFF', '#00FF00', '#FFFF00'];
  var usedNames = [];

  function generateResult() {
    var title = $('#rcgnew_title').val();
    var names = $('#rcgnew_names').val().split('\n').map(function(name) {
      return name.trim();
    }).filter(function(name) {
      return name !== '';
    });
    var allowDuplicates = $('#rcgnew_checkbox').is(':checked');

    if (names.length === 0) {
      alert('Please enter at least one choice.');
      return;
    }

    if (!allowDuplicates && usedNames.includes('Berivan') && usedNames.length === names.length) {
      alert('No more available choices.');
      return;
    }

    var availableNames = allowDuplicates ? names : names.filter(function(name) {
      return !usedNames.includes(name);
    });

    if (availableNames.length === 0) {
      alert('No more available choices.');
      return;
    }

    var selectedName;
    if (availableNames.includes('Berivan') && availableNames.length === 1) {
      selectedName = 'Berivan';
    } else {
      var randomIndex = Math.floor(Math.random() * availableNames.length);
      selectedName = availableNames[randomIndex];
    }

    usedNames.push(selectedName);

    // Disable the buttons
    $('.rcgnew_go').addClass('disabled');

    animateBackground(selectedName, usedNames.length, function() {
      var resultDiv = $('<div class="rcgnew_result"></div>').attr('id', 'rcount_' + usedNames.length);
      var resultNum = $('<span class="result_num"></span>').text(usedNames.length);
      var resultText = $('<span class="result_text"></span>').text(selectedName);
      resultDiv.append(resultNum, resultText);
      $('#rcgnew_results').append(resultDiv);
    
      resultDiv.css({
        opacity: 0,
        marginTop: '20px'
      }).animate({
        opacity: 1,
        marginTop: '0'
      }, 500, function() {
        // Enable the buttons after the animation is complete
        $('.rcgnew_go').removeClass('disabled');
      });

      // Scroll to align the bottom of rcgnew2 with the bottom of the viewport
      var rcgnew2Bottom = $('.rcgnew2').offset().top + $('.rcgnew2').outerHeight();
      var windowBottom = $(window).scrollTop() + $(window).height();
      var scrollPosition = rcgnew2Bottom - $(window).height() + 40; // Add 40px bottom gap

      if (scrollPosition > $(window).scrollTop()) {
        $('html, body').animate({
          scrollTop: scrollPosition
        }, 500);
      }
    });
  }

  $('form').submit(function(e) {
    e.preventDefault();
    generateResult();
  });

  $('#rcgnew_go_again').click(function() {
    generateResult();
  });

  $('#rcgnew_names').on('input', function() {
    updateUrl();
  });

  $('#rcgnew_checkbox').on('change', function() {
    // No need to check button state here
  });

  $('#rcgnew_reset').click(function() {
    if (confirm('Are you sure you want to reset and delete all results?')) {
      usedNames = [];
      $('#rcgnew_results').empty();
    }
  });

  function animateBackground(selectedName, resultCount, callback) {
    var currentColorIndex = 0;
    var intervalId = setInterval(function() {
      $('.rcgnew2').css('background-color', colors[currentColorIndex]);
      currentColorIndex = (currentColorIndex + 1) % colors.length;
    }, 200);

    setTimeout(function() {
      clearInterval(intervalId);
      $('.rcgnew2').css('background-color', '#D5FB96');
      callback();
    }, 2000);
  }

  $('#rcgnew_title').on('input', function() {
    var title = $(this).val().trim();
    $('#rcgnew_results_title').text(title ? title : 'Results');
    updateUrl();
  });

  function updateUrl() {
    var title = $('#rcgnew_title').val().trim().replace(/ /g, '_');
    var names = $('#rcgnew_names').val().split('\n').map(function(name) {
      return name.trim().replace(/ /g, '_');
    }).filter(function(name) {
      return name !== '';
    });

    var url = window.location.origin + window.location.pathname;
    var queryParams = [];

    if (title) {
      queryParams.push('title=' + encodeURIComponent(title));
    }

    if (names.length > 0) {
      var encodedNames = names.map(function(name) {
        return encodeURIComponent(name);
      });
      queryParams.push('names=' + encodedNames.join(','));
    }

    var query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
    var fullUrl = url + query;

    history.pushState({}, null, fullUrl);
    $('#rcgnew_share').text(fullUrl);
  }

  function loadUrlParams() {
    var urlParams = new URLSearchParams(window.location.search);
    var titleParam = urlParams.get('title');
    var namesParam = urlParams.get('names');

    if (titleParam) {
      var decodedTitle = titleParam.replace(/_/g, ' ');
      $('#rcgnew_title').val(decodedTitle);
      $('#rcgnew_results_title').text(decodedTitle);
    }

    if (namesParam) {
      var decodedNames = decodeURIComponent(namesParam.replace(/\+/g, ' '));
      var names = decodedNames.split(',').map(function(name) {
        return name.replace(/_/g, ' ');
      });

      $('#rcgnew_names').val(names.join('\n'));
    }

    updateUrl();
  }

  $('#rcgnew_share_copy').on('click', function() {
    var urlText = $('#rcgnew_share').text();
    copyToClipboard(urlText);
    alert('URL copied to clipboard!');
  });

  function copyToClipboard(text) {
    var tempInput = $('<input>');
    $('body').append(tempInput);
    tempInput.val(text).select();
    document.execCommand('copy');
    tempInput.remove();
  }

  loadUrlParams();
  
  // click to highlight share url
  document.getElementById('rcgnew_share').addEventListener('click', function() {
    var range = document.createRange();
    range.selectNodeContents(this);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });
});

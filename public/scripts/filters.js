window.ls.filter
  .add("avatar", function($value, element) {
    if (!$value) {
      return "";
    }

    let size = element.dataset["size"] || 80;
    let name = $value.name || $value || "";
    
    name = (typeof name !== 'string') ? '--' : name;

    return def =
      "/v1/avatars/initials?project=console"+
      "&name=" +
      encodeURIComponent(name) +
      "&width=" +
      size +
      "&height=" +
      size;
  })
  .add("selectedCollection", function($value, router) {
    return $value === router.params.collectionId ? "selected" : "";
  })
  .add("selectedDocument", function($value, router) {
    return $value === router.params.documentId ? "selected" : "";
  })
  .add("localeString", function($value) {
    $value = parseInt($value);
    return !Number.isNaN($value) ? $value.toLocaleString() : "";
  })
  .add("date", function($value, date) {
    return date.format("Y-m-d", $value);
  })
  .add("date-time", function($value, date) {
    return date.format("Y-m-d H:i", $value);
  })
  .add("date-text", function($value, date) {
    return date.format("d M Y", $value);
  })
  .add("ms2hum", function($value) {
    let temp = $value;
    const years = Math.floor(temp / 31536000),
      days = Math.floor((temp %= 31536000) / 86400),
      hours = Math.floor((temp %= 86400) / 3600),
      minutes = Math.floor((temp %= 3600) / 60),
      seconds = temp % 60;

    if (days || hours || seconds || minutes) {
      return (
        (years ? years + "y " : "") +
        (days ? days + "d " : "") +
        (hours ? hours + "h " : "") +
        (minutes ? minutes + "m " : "") +
        Number.parseFloat(seconds).toFixed(0) +
        "s"
      );
    }

    return "< 1s";
  })
  .add("markdown", function($value, markdown) {
    return markdown.render($value);
  })
  .add("pageCurrent", function($value, env) {
    return Math.ceil(parseInt($value || 0) / env.PAGING_LIMIT) + 1;
  })
  .add("pageTotal", function($value, env) {
    let total = Math.ceil(parseInt($value || 0) / env.PAGING_LIMIT);
    return total ? total : 1;
  })
  .add("humanFileSize", function($value) {
    if (!$value) {
      return 0;
    }

    let thresh = 1000;

    if (Math.abs($value) < thresh) {
      return $value + " B";
    }

    let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let u = -1;

    do {
      $value /= thresh;
      ++u;
    } while (Math.abs($value) >= thresh && u < units.length - 1);

    return (
      $value.toFixed(1) +
      '<span class="text-size-small unit">' +
      units[u] +
      "</span>"
    );
  })
  .add("statsTotal", function($value) {
    if (!$value) {
      return 0;
    }

    $value = abbreviate($value, 0, false, false);

    return $value === "0" ? "N/A" : $value;
  })
  .add("isEmpty", function($value) {
    return (!!$value);
  })
  .add("isEmptyObject", function($value) {
    return ((Object.keys($value).length === 0 && $value.constructor === Object) || $value.length === 0)
  })
  .add("activeDomainsCount", function($value) {
    let result = [];
    
    if(Array.isArray($value)) {
      result = $value.filter(function(node) {
        return (node.verification && node.certificateId);
      });
    }

    return result.length;
  })
  .add("documentAction", function(container) {
    let collection = container.get('project-collection');
    let document = container.get('project-document');

    if(collection && document && !document.$id) {
      return 'database.createDocument';
    }

    return 'database.updateDocument';
  })
  .add("documentSuccess", function(container) {
    let document = container.get('project-document');

    if(document && !document.$id) {
      return ',redirect';
    }

    return '';
  })
  .add("firstElement", function($value) {
    if($value && $value[0]) {
      return $value[0];
    }

    return $value;
  })
  .add("platformsLimit", function($value) {
    return $value;
  })
  .add("limit", function($value) {
    let postfix = ($value.length >= 50) ? '...' : '';
    return $value.substring(0, 50) + postfix;
    ;
  })
  .add("arraySentence", function($value) {
    if(!Array.isArray($value)) {
      return '';
    }

    return $value.join(", ").replace(/,\s([^,]+)$/, ' and $1');
  })
;

function abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
  number = Number(number);
  forceLetter = forceLetter || false;
  if (forceLetter !== false) {
    return annotate(number, maxPlaces, forcePlaces, forceLetter);
  }
  let abbr;
  if (number >= 1e12) {
    abbr = "T";
  } else if (number >= 1e9) {
    abbr = "B";
  } else if (number >= 1e6) {
    abbr = "M";
  } else if (number >= 1e3) {
    abbr = "K";
  } else {
    abbr = "";
  }
  return annotate(number, maxPlaces, forcePlaces, abbr);
}

function annotate(number, maxPlaces, forcePlaces, abbr) {
  // set places to false to not round
  let rounded = 0;
  switch (abbr) {
    case "T":
      rounded = number / 1e12;
      break;
    case "B":
      rounded = number / 1e9;
      break;
    case "M":
      rounded = number / 1e6;
      break;
    case "K":
      rounded = number / 1e3;
      break;
    case "":
      rounded = number;
      break;
  }
  if (maxPlaces !== false) {
    let test = new RegExp("\\.\\d{" + (maxPlaces + 1) + ",}$");
    if (test.test("" + rounded)) {
      rounded = rounded.toFixed(maxPlaces);
    }
  }
  if (forcePlaces !== false) {
    rounded = Number(rounded).toFixed(forcePlaces);
  }
  return rounded + abbr;
}

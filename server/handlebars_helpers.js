
module.exports = function (handlebars) {

  handlebars.registerHelper('addOrgDropDown', function(items, options) {
    var out = "<select name = 'organisation' class='dropdown title'><option>- </option>";

    for(var i=0, l=items.length; i<l; i++) {
      out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
    }

    return out + "</select>";
  });

  handlebars.registerHelper('removeEmailDropDown', function(items, options) {
    var out = "<select name = 'removeEmailAddress' class='dropdown title'><option>- </option>";

    for(var i=0, l=items.length; i<l; i++) {
      out = out + "<option value='" + items[i].address + "'>" + options.fn(items[i]) + "</option>";
    }

    return out + "</select>";
  });

  handlebars.registerHelper('removeOrgDropDown', function(items, options) {
    var out = "<select name = 'removeOrganisation' class='dropdown title'><option>- </option>";

    for(var i=0, l=items.length; i<l; i++) {
      out = out + "<option value='" + items[i]._id + "'>" + options.fn(items[i]) + "</option>";
    }

    return out + "</select>";
  });
};
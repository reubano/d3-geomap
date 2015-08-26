addAccessor = (obj, name, value) ->
  obj[name] = (_) ->
    if not arguments.length
      return obj.properties[name] || value
    obj.properties[name] = _
    obj

module.exports = addAccessor

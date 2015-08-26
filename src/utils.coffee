addAccessor = (obj, name, value)->
    obj[name] = (_)->
        if not arguments.length
            return obj.properties[name] || value
        obj.properties[name] = _
        obj

root = (exports? or this)
root.addAccessor = addAccessor
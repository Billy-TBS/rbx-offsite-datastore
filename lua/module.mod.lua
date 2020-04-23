-- Put this inside of the Data Script. This is a Module Script

local mod = {}
local http = game:GetService('HttpService')

local config = require(script.Config)

local function Request(TypeOfRequest, RequestInfo)
	RequestInfo["auth_key"] = config.authorization_key
	local response = http:RequestAsync(
		{
			Url = config.url..TypeOfRequest,
			Method = "POST",
			Headers = {
				["Content-Type"] = "application/json"
			},
			Body = http:JSONEncode(RequestInfo)
		}
	)
	if response.Success then
		print("Status:", response.StatusCode)
		print("Response:", response.Body)
		return response.Body
	else
		print("The request failed:", response.StatusCode, response.Body)
	end
end


function mod.GetData(userid, typofdata)
	assert(typeof(userid) == "string", "Error: UserId must be a string!") -- UserId has to be a string because fs checks folders as a string, you could always do this on the server, but you may as well just get it done here.
	assert(typeof(typofdata) == "string", "Error: Type of Data must be a string!")
	local Body = {
			uid = userid,
			dataname = typofdata..".txt"
	}
	local success, result = pcall(function()
		return Request('GetData', Body)
	end)
	print(result)
	return result
end
function mod.SetData(userid, typofdata, datae)
	assert(typeof(userid) == "string", "An error occured, UserId must be a string!")
	assert(typeof(typofdata) == "string", "An error occured, Type of Data must be a string!")
	assert(typeof(datae) == "string", "An error occured, Data must be a string!")
	local Body = {
			uid = userid,
			dataname = typofdata..".txt",
			data = datae
	}
	local success, result = pcall(function()
		return Request('SetData', Body)
	end)
	print(result)
end
return mod

﻿var JSLink_CSOM = (function () {

    var cTor = function (wpId, pagePath, dfd) {
        if (!dfd) {
            dfd = jQuery.Deferred();
        }

        var webPartId = new SP.Guid(wpId);
        var ctx = new SP.ClientContext(smilOnline.appWebUrl);
        var factory = new SP.ProxyWebRequestExecutorFactory(smilOnline.appWebUrl);
        ctx.set_webRequestExecutorFactory(factory);
        var appContextSite = new SP.AppContextSite(ctx, smilOnline.hostWebUrl);
        var page = appContextSite.get_web().getFileByServerRelativeUrl(pagePath);
        var wpm = page.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
        var webpartDefinitions = wpm.get_webParts();

        ctx.load(webpartDefinitions);
        ctx.executeQueryAsync(function () {
            var webPartDefinition = webpartDefinitions.getById(webPartId);
            var webPart = webPartDefinition.get_webPart();
            var webPartProperties = webPart.get_properties();
            ctx.load(webPartProperties);
            ctx.executeQueryAsync(function () {
                webPartProperties.set_item("JSLink", "~site/SmilOnlineAssets/smilOnlineMap.js");
                webPartDefinition.saveWebPartChanges();
                ctx.executeQueryAsync(function () {
                    dfd.resolve();
                },
                function () {
                    console.log("Could not add JSLInk to view " + pagePath);
                });
            },
            function () {
                console.log("Could not add JSLInk to view " + pagePath);
            });
        },
        function () {
            console.log("Could not add JSLInk to view " + pagePath);
            dfd.resolve();
        });
        return dfd;
    };
    return cTor;
})();
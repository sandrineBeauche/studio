module.exports = {
	
    "Detailed form by default": function (browser) {
        browser
            .login()
            .closeNotification()
            .freshWorkflow()
            .waitForElementVisible('#accordion-properties')
            .assert.elementNotPresent("#simple-form")
            .createTask()
            .click(".task")
            .waitForElementVisible('#accordion-properties')
            .assert.elementNotPresent("#simple-form")
            .end();
    },

    "Switch from job to simple view and back": function (browser) {
        browser
            .login()
            .closeNotification()
            .freshWorkflow()
            .assert.elementPresent("#accordion-properties")
            .assert.elementPresent("#form-switch")
            .click("#form-switch")
            .waitForElementVisible('#confirm-data-loss')
            .assert.containsText('#confirm-data-loss', 'After switching to simple view all custom selection scripts will be lost')
            .click("#data-loss-continue")
            .waitForElementVisible('#simple-form')
            .assert.elementNotPresent("#accordion-properties")
            .click("#form-switch")
            .waitForElementVisible('#accordion-properties')
            .assert.elementPresent("[placeholder='@attributes->priority']")
            .end();
    },

    "Switch from task to detailed view and back": function (browser) {
        browser
            .login()
            .closeNotification()
            .freshWorkflow()
            .createTask()
            .click(".task")
            .assert.elementPresent("#form-switch")
            .click("#form-switch")
            .waitForElementVisible('#accordion-properties')
            .assert.elementPresent("#Execution")
            .assert.elementPresent("#form-switch")
            .click("#form-switch")
            .waitForElementVisible('#confirm-data-loss')
            .assert.containsText('#confirm-data-loss', 'After switching to simple view all custom selection scripts will be lost')
            .click("#data-loss-continue")
            .waitForElementVisible('#simple-form')
            .end();
    },
	
    "Check selection script generation": function (browser) {
    	
    	// Input values
    	var _hostNameVal = 'host_name';
    	var _operatingSystemVal = 'linux';
    	var _reqMemVal = '1000000'
    	
        browser
            .login()
            .closeNotification()
            .freshWorkflow()
            .createTask()
            .click(".task")
            .assert.elementPresent("#form-switch")
            .click("#form-switch")
            .waitForElementVisible('#confirm-data-loss')
            .assert.containsText('#confirm-data-loss', 'After switching to simple view all custom selection scripts will be lost')
            .click("#data-loss-continue")
            .waitForElementVisible("#simple-form")
            .waitForElementVisible("input[name='Host Name']")
            .setValue("input[name='Host Name']", _hostNameVal)
            .waitForElementVisible("select[name='Operating System']")
            .setValue("select[name='Operating System']", _operatingSystemVal)
            .waitForElementVisible("input[name='Required amount of memory (in mb)']")
            .setValue("input[name='Required amount of memory (in mb)']", _reqMemVal)
            .waitForElementVisible("input[name='Dedicated Host']")
            .click("input[name='Dedicated Host']")
            .checkExport(function (select, jobXmlDocument) {
                var hostNameXml = select("string(//p:genericInformation/p:info[@name='Host Name']/@value)",
                		jobXmlDocument)
                var operatingSystemXml = select("string(//p:genericInformation/p:info[@name='Operating System']/@value)",
                		jobXmlDocument)
                var reqMemXml = select("string(//p:genericInformation/p:info[@name='Required amount of memory (in mb)']/@value)",
                		jobXmlDocument)
                var topology = select("//p:singleHostExclusive", jobXmlDocument);
                this.assert.equal(hostNameXml, _hostNameVal, "Host Name value check")
                this.assert.equal(operatingSystemXml, _operatingSystemVal, "Operating System value check")
                this.assert.equal(reqMemXml, _reqMemVal, "Required Mem value check")
                this.assert.equal(topology.length, 1, "Topology descriptor check")
            })
            .end();
    }
};

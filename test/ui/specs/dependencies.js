module.exports = {
    "Pull out a dependency" : function(browser) {
        browser
            .login()
            .freshWorkflow()
            .createTask()
            .waitForElementVisible('.dependency-source-endpoint', 1000)
            .moveToElement('.dependency-source-endpoint', 0, 10)
            .mouseButtonDown(0)
            .moveToElement('#workflow-designer', 200, 200)
            .mouseButtonUp(0)
            .checkExport(function (select, jobXmlDocument) {
                var tasksWithoutDependency = select('//p:task[not(child::p:depends)]/@name', jobXmlDocument);
                var tasksWithDependency = select('//p:task[p:depends]/@name', jobXmlDocument);
                var dependencies = select('//p:task/p:depends/p:task/@ref', jobXmlDocument);

                this.assert.equal(tasksWithoutDependency.length, 1, "Number of tasks without dependency");
                this.assert.equal(tasksWithDependency.length, 1, "Number of tasks with dependency");
                this.assert.equal(dependencies.length, 1, "Number of dependencies");

                var parent = tasksWithoutDependency[0].nodeValue;
                var child = tasksWithDependency[0].nodeValue;
                var dependency = dependencies[0].nodeValue;

                this.assert.notEqual(parent, child, "Child is not the same as parent");
                this.assert.equal(parent, dependency, "Child depends on parent");

            })
            .end()

    }
}

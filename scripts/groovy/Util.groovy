class Util {
    static String buildResultData(build, out) {
        def jobName = build.project.name
        def jobUrl = build.getUrl()
        def jobResult = build.result.toString()
        def jobResultAction = build.getTestResultAction()

        // collect test results
        def testsTotal = (jobResultAction) ? jobResultAction.getTotalCount() : 0
        def testsSkipped = (jobResultAction) ? jobResultAction.getSkipCount() : 0
        def testsFailed = (jobResultAction) ? jobResultAction.getFailCount() : 0
        def resultString = "" + [jobName, jobUrl, jobResult, testsTotal, testsSkipped, testsFailed].join(';')
        out.println "        JobResult: " + jobName + " Result:" + resultString
        return resultString
    }

    static boolean writeJobResults(bundle, stage, builds, workspace, out) {
    def success = true
        for ( build in builds ) {
            def dataString = buildResultData(build, out)
            // write test results to metadata
            def cmd = "bash ${workspace}/scripts/repo/add_metadata.sh ${bundle} ${stage}_stage_results ${dataString}"
            out.println "        Cmd: ${cmd}"
            def process = cmd.execute()
            process.waitFor()
            if (! "".equals(process.text) || ! "".equals(process.err.text)) {
                out.println "        Out: ${process.text}"
                out.println "        Err: ${process.err.text}"
            }
            // merge overall success
            success = (success == true && build.build.result.toString() == "SUCCESS")
        }
        out.println "    Overall Success: " + success
        return success
    }
    void main(param){
    }
}

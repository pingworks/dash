class Util {
    static String jobResultData(job, out) {
        def jobName = job.name
        def jobUrl = job.build.getUrl()
        def jobResult = job.build.result.toString()
        def jobResultAction = job.build.testResultAction

        // collect test results
        def testsTotal = (jobResultAction) ? jobResultAction.getTotalCount() : 0
        def testsSkipped = (jobResultAction) ? jobResultAction.getSkipCount() : 0
        def testsFailed = (jobResultAction) ? jobResultAction.getFailCount() : 0
        def resultString = "" + [jobName, jobUrl, jobResult, testsTotal, testsSkipped, testsFailed].join(';')
        out.println "        JobResult: " + jobName + " Result:" + resultString
        return resultString
    }

    static boolean writeJobResults(bundle, jobs, workspace, out) {
    def success = true
        for ( job in jobs ) {
            def dataString = jobResultData(job, out)
            // write test results to metadata
            def cmd = "bash ${workspace}/scripts/repo/add_metadata.sh ${bundle} first_stage_results ${dataString}"
            out.println "        Cmd: ${cmd}"
            def process = cmd.execute()
            process.waitFor()
            if (! "".equals(process.text) || ! "".equals(process.err.text)) {
                out.println "        Out: ${process.text}"
                out.println "        Err: ${process.err.text}"
            }
            // merge overall success
            success = (success == true && job.build.result.toString() == "SUCCESS")
        }
        out.println "    Overall Success: " + success
        return success
    }
    void main(param){
    }
}

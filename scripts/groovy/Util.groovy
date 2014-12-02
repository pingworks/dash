class Util {
    static String createBuildResultData(build, out) {
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

    static boolean writeBuildResults(bundle, stage, builds, workspace, out) {
    def success = true
        for ( build in builds ) {
            def dataString = createBuildResultData(build, out)
            // write test results to metadata
            def cmd = "bash ${workspace}/scripts/repo/add_metadata.sh ${bundle} ${stage}_stage_results ${dataString}"
            out.println "        Cmd: ${cmd}"
            def process = cmd.execute()
            process.waitFor()
            if (! "".equals(process.text) || ! "".equals(process.err.text)) {
                try {
                    out.println "        Out: ${process.in.text}"
                    out.println "        Err: ${process.err.text}"
                } catch (IOException e) {

                }
            }
            // merge overall success
            success = (success == true && build.result.toString() == "SUCCESS")
        }
        out.println "    Overall Success: " + success
        return success
    }

    static boolean writeStageStatus(bundle, stage, status, workspace, out) {
      def cmd = "bash ${workspace}/scripts/repo/set_stage_status.sh ${bundle} ${stage} ${status}"
      out.println "        Cmd: ${cmd}"
      def process = cmd.execute()
      process.waitFor()
      if (! "".equals(process.text) || ! "".equals(process.err.text)) {
        try {
          out.println "        Out: ${process.in.text}"
          out.println "        Err: ${process.err.text}"
        } catch (IOException e) {

        }
      }
    }

    static boolean writeBuildResultsAndStageStatus(bundle, stage, builds, workspace, out, failureOnly=false) {
      def success = writeBuildResults(bundle, stage, builds, workspace, out)
      def successString = (success) ? "passed" : "failed"
      if (!success || !failureOnly) {
        writeStageStatus(bundle, stage, successString, workspace, out)
      }
    }

    void main(param){
    }
}

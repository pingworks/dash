class Util {

    static String exec(cmd, out = null, exitOnError = true) {
        def sout = new StringBuffer()
        def serr = new StringBuffer()

        def proc = cmd.execute()
        proc.consumeProcessOutput(sout, serr)
        proc.waitFor()
        def exitCode = proc.exitValue()
        if (out != null) {
            out.println "        Cmd: ${cmd}"
            out.println "        Out: ${sout}"
            out.println "        Err: ${serr}"
            out.println "        EC : ${exitCode}"
        }
        if (exitCode && exitOnError) {
            throw new RuntimeException("Script Execution failed. Cmd: ${cmd}, Out: ${sout}, Err: ${serr}, EC: ${exitCode}")
        }
        return sout
    }

    static String startBuild(pname, branch, rev, bnum, src_dir, workspace, out) {
        out.println "Starting pipeline for pname:" + pname + " branch:" + branch + " rev:" + rev + " bnum:" + bnum
        def branch_id = branch.replaceAll(/\//, "__")

        def cmd = "bash ${workspace}/scripts/repo/get_bundlename.sh ${pname} ${branch} ${rev} ${bnum}"
        def bundle = exec(cmd, out)
        out.println "Bundle:" + bundle

        cmd = "bash ${workspace}/scripts/repo/prepare_build.sh ${pname} ${branch_id} ${rev} ${bnum} ${branch}"
        exec(cmd, out)

        cmd = "bash ${workspace}/scripts/repo/prepare_bundle.sh ${pname} ${branch_id} ${rev} ${bnum} ${branch} ${src_dir}"
        exec(cmd, out)

        cmd = "bash ${workspace}/scripts/repo/set_stage_status.sh ${bundle} first in_progress"
        exec(cmd, out)

        return bundle
    }

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
            exec(cmd, out)
            // merge overall success
            success = (success == true && build.result.toString() == "SUCCESS")
        }
        out.println "    Overall Success: " + success
        return success
    }

    static boolean writeStageStatus(bundle, stage, status, workspace, out) {
      def cmd = "bash ${workspace}/scripts/repo/set_stage_status.sh ${bundle} ${stage} ${status}"
      exec(cmd, out)
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

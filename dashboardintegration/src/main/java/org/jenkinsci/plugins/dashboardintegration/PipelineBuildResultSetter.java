package org.jenkinsci.plugins.dashboardintegration;

import java.io.IOException;

import hudson.Launcher;
import hudson.Proc;
import hudson.model.AbstractBuild;
import hudson.model.BuildListener;
import hudson.model.Result;
import hudson.tasks.test.AbstractTestResultAction;
import jenkins.model.Jenkins;
import org.apache.commons.lang.StringUtils;

/**
 */
public class PipelineBuildResultSetter {

    private AbstractBuild build;

    private Launcher launcher;

    private BuildListener listener;

    public PipelineBuildResultSetter(AbstractBuild build, Launcher launcher, BuildListener listener) {
        this.build = build;
        this.launcher = launcher;
        this.listener = listener;
    }

    public boolean recordBuildResults(String pipelineBuildId, String stage, String scriptDir, String buildName) throws IOException, InterruptedException {

      if (scriptDir.equals("use_local")) {
        scriptDir = build.getWorkspace().toString() + "/scripts";
      }

        String[] cmdStrings = new String[]{
                "/bin/bash",
                scriptDir + "/repo/add_build_result.sh",
                pipelineBuildId,
                stage,
                getBuildResultString(build, buildName)
        };

        Launcher.ProcStarter ps = launcher.new ProcStarter();
        ps = ps.cmds(cmdStrings).stdout(listener);
        ps = ps.pwd(build.getWorkspace()).envs(build.getEnvironment(listener));

        Proc proc = launcher.launch(ps);
        return (proc.join() == 0);
    }

    private String getBuildResultString(AbstractBuild build, String buildName) {
        String result = (build.getResult() != null) ? build.getResult().toString() : "IN_PROGRESS";
        AbstractTestResultAction buildResultAction = build.getAction(AbstractTestResultAction.class);
        Integer testsTotal = (buildResultAction != null) ? buildResultAction.getTotalCount() : 0;
        Integer testsSkipped = (buildResultAction != null) ? buildResultAction.getSkipCount() : 0;
        Integer testsFailed = (buildResultAction != null) ? buildResultAction.getFailCount() : 0;
        if (buildName == null || buildName.equals("")) {
            buildName = build.getProject().getName();
        }
        return StringUtils.join(
                new String[]{
                        buildName,
                        Jenkins.getInstance().getRootUrl() + build.getUrl(),
                        result,
                        testsTotal.toString(),
                        testsSkipped.toString(),
                        testsFailed.toString()
                },
                ";"
        );
    }

}

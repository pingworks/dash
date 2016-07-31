package org.jenkinsci.plugins.dashboardintegration;

import hudson.Launcher;
import hudson.Proc;
import hudson.model.AbstractBuild;
import hudson.model.BuildListener;
import hudson.model.Result;

import java.io.IOException;

/**
 */
public class PipelineStageStatusSetter {

    private AbstractBuild build;

    private Launcher launcher;

    private BuildListener listener;

    public PipelineStageStatusSetter(AbstractBuild build, Launcher launcher, BuildListener listener) {
        this.build = build;
        this.launcher = launcher;
        this.listener = listener;
    }

    boolean setStageStatus(String pipelineBuildId, String stage, String status, String scriptDir, boolean ignoreFailures) {
        try {
            boolean exitCode;
            Result originalResult = build.getResult();
            if (scriptDir.equals("use_local")) {
              scriptDir = build.getWorkspace().toString() + "/scripts";
            }
            String[] cmdStrings = new String[]{
                    "/bin/bash",
                    scriptDir + "/repo/set_stage_status.sh",
                    pipelineBuildId,
                    stage,
                    status
            };

            Launcher.ProcStarter ps = launcher.new ProcStarter();
            ps = ps.cmds(cmdStrings).stdout(listener);
            ps = ps.pwd(build.getWorkspace()).envs(build.getEnvironment(listener));

            Proc proc = launcher.launch(ps);
            exitCode = (proc.join() == 0);

            if (ignoreFailures) {
                build.setResult(originalResult);
                exitCode = true;
            }
            return exitCode;
        } catch (IOException e) {
            e.printStackTrace();
            e.printStackTrace(listener.getLogger());
            listener.getLogger().println("IOException !");
            return false;
        } catch (InterruptedException e) {
            e.printStackTrace();
            listener.getLogger().println("InterruptedException!");
            return false;
        }
    }

}

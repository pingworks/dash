package org.jenkinsci.plugins.dashboardintegration;
import hudson.Launcher;
import hudson.Extension;
import hudson.Proc;
import hudson.model.*;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Recorder;
import hudson.tasks.test.AbstractTestResultAction;
import hudson.tasks.Builder;
import hudson.tasks.BuildStepDescriptor;
import hudson.util.ListBoxModel;
import jenkins.model.Jenkins;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

import java.io.IOException;

import hudson.tasks.Publisher;

/**
 * Sample {@link Builder}.
 *
 *
 * <p>
 * When a build is performed, the {@link #perform(AbstractBuild, Launcher, BuildListener)}
 * method will be invoked. 
 *
 * @author Kohsuke Kawaguchi
 */
public class ProjectBuildResultPublisher extends Publisher {

    private final String pipelineBuildId;

    private final String pipelineStage;

    private final boolean buildSetsStageToFailure;

    private final boolean buildSetsStageToSuccess;

    private final boolean ignoreFailures;

    private final String buildName;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public ProjectBuildResultPublisher(String pipelineBuildId, String pipelineStage,
                                       boolean buildSetsStageToFailure, boolean buildSetsStageToSuccess,
                                       boolean ignoreFailures, String buildName) {
        this.pipelineBuildId = pipelineBuildId;
        this.pipelineStage = pipelineStage;
        this.buildSetsStageToFailure = buildSetsStageToFailure;
        this.buildSetsStageToSuccess = buildSetsStageToSuccess;
        this.ignoreFailures = ignoreFailures;
        this.buildName = buildName;
    }

    public String getPipelineBuildId() {
        return pipelineBuildId;
    }

    public String getPipelineStage() {
        return pipelineStage;
    }

    public boolean isBuildSetsStageToFailure() {
        return buildSetsStageToFailure;
    }

    public boolean isBuildSetsStageToSuccess() {
        return buildSetsStageToSuccess;
    }

    public boolean isIgnoreFailures() {
        return ignoreFailures;
    }

    public String getBuildName() {
        return buildName;
    }

    @Override
    public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) {

        try {
            Result originalResult = build.getResult();

            boolean exitCode = recordBuildResults(build, launcher, listener, buildName);

            if (isBuildSetsStageToFailure() && originalResult != Result.SUCCESS) {
                String stageStatus = "failed";
                exitCode &= setPipelineStageStatus(build, launcher, listener, stageStatus);
            }

            if (isBuildSetsStageToSuccess() && originalResult == Result.SUCCESS) {
                String stageStatus = "passed";
                exitCode &= setPipelineStageStatus(build, launcher, listener, stageStatus);
            }
            if (isIgnoreFailures()) {
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

    private boolean recordBuildResults(AbstractBuild build, Launcher launcher, BuildListener listener, String buildName) throws IOException, InterruptedException {
        String[] cmdStrings = new String[]{
                "/bin/bash",
                getScriptDir() + "/repo/add_metadata.sh",
                getPipelineBuildId(),
                getPipelineStage() +"_stage_results",
                getBuildResultString(build, buildName)
        };

        Launcher.ProcStarter ps = launcher.new ProcStarter();
        ps = ps.cmds(cmdStrings).stdout(listener);
        ps = ps.pwd(build.getWorkspace()).envs(build.getEnvironment(listener));

        Proc proc = launcher.launch(ps);
        return (proc.join() == 0);
    }

    private boolean setPipelineStageStatus(AbstractBuild build, Launcher launcher, BuildListener listener, String stageStatus) throws IOException, InterruptedException {
        String[] cmdStrings = new String[]{
                "/bin/bash",
                getScriptDir() + "/repo/set_stage_status.sh",
                getPipelineBuildId(),
                getPipelineStage(),
                stageStatus
        };

        Launcher.ProcStarter ps = launcher.new ProcStarter();
        ps = ps.cmds(cmdStrings).stdout(listener);
        ps = ps.pwd(build.getWorkspace()).envs(build.getEnvironment(listener));

        Proc proc = launcher.launch(ps);
        return (proc.join() == 0);
    }

    private String getBuildResultString(AbstractBuild build, String buildName) {
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
                        build.getResult().toString(),
                        testsTotal.toString(),
                        testsSkipped.toString(),
                        testsFailed.toString()
                },
                ";"
        );
    }

    private String getScriptDir() throws IOException{
        PipelineBuildCreatorBuilder.DescriptorImpl descriptor =
                (PipelineBuildCreatorBuilder.DescriptorImpl) Jenkins.getInstance().getDescriptor(PipelineBuildCreatorBuilder.class);
        return descriptor.getScriptDir();
    }

    public BuildStepMonitor getRequiredMonitorService() {
        return BuildStepMonitor.NONE;
    }

    /**
     * Descriptor for {@link ProjectBuildResultPublisher}. Used as a singleton.
     * The class is marked as public so that it can be accessed from views.
     *
     * <p>
     * See <tt>src/main/resources/hudson/plugins/hello_world/ProjectBuildResultPublisher/*.jelly</tt>
     * for the actual HTML fragment for the configuration screen.
     */
    @Extension
    public static final class DescriptorImpl extends BuildStepDescriptor<Publisher> {
        /**
         * In order to load the persisted global configuration, you have to
         * call load() in the constructor.
         */
        public DescriptorImpl() {
            load();
        }

        public boolean isApplicable(Class<? extends AbstractProject> aClass) {
            // Indicates that this builder can be used with all kinds of project types
            return true;
        }

        /**
         * This human readable name is used in the configuration screen.
         */
        public String getDisplayName() {
            return "Dashboard: Add project build results to pipeline stage";
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) throws FormException {
            save();
            return super.configure(req,formData);
        }

        public ListBoxModel doFillPipelineStageItems() {
            ListBoxModel items = new ListBoxModel();
            items.add("First Stage", "first");
            items.add("Second Stage", "second");
            items.add("Third Stage", "third");
            return items;
        }
    }
}


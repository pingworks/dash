package org.jenkinsci.plugins.dashboardintegration;

import java.io.IOException;

import jenkins.model.Jenkins;
import net.sf.json.JSONObject;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

import hudson.Extension;
import hudson.Launcher;
import hudson.Proc;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.model.BuildListener;
import hudson.model.Result;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Publisher;
import hudson.tasks.Recorder;
import hudson.util.ListBoxModel;

/**
 * Sample {@link hudson.tasks.Builder}.
 *
 *
 * <p>
 * When a build is performed, the {@link #perform(hudson.model.AbstractBuild, hudson.Launcher, hudson.model.BuildListener)}
 * method will be invoked.
 *
 * @author Kohsuke Kawaguchi
 */
public class PipelineStageFinisher extends Recorder {

    private final String pipelineBuildId;

    private final String pipelineStage;

    private final String pipelineStageStatus;

    private final boolean ignoreFailures;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public PipelineStageFinisher(String pipelineBuildId, String pipelineStage, String pipelineStageStatus,
                                 boolean ignoreFailures) {
        this.pipelineBuildId = pipelineBuildId;
        this.pipelineStage = pipelineStage;
        this.pipelineStageStatus = pipelineStageStatus;
        this.ignoreFailures = ignoreFailures;
    }

    public String getPipelineBuildId() {
        return pipelineBuildId;
    }

    public String getPipelineStage() {
        return pipelineStage;
    }

    public String getPipelineStageStatus() {
        return pipelineStageStatus;
    }

    public boolean isIgnoreFailures() {
        return ignoreFailures;
    }

    @Override
    public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) {

        try {
            Result originalResult = build.getResult();
            boolean exitCode = setPipelineStageStatus(build, launcher, listener);

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

    private boolean setPipelineStageStatus(AbstractBuild build, Launcher launcher, BuildListener listener) throws IOException, InterruptedException {
        String[] cmdStrings = new String[]{
                "/bin/bash",
                getScriptDir() + "/repo/set_stage_status.sh",
                getPipelineBuildId(),
                getPipelineStage(),
                getPipelineStageStatus()
        };

        Launcher.ProcStarter ps = launcher.new ProcStarter();
        ps = ps.cmds(cmdStrings).stdout(listener);
        ps = ps.pwd(build.getWorkspace()).envs(build.getEnvironment(listener));

        Proc proc = launcher.launch(ps);
        return (proc.join() == 0);
    }

    private String getScriptDir() throws IOException{
        PipelineBuildCreator.DescriptorImpl descriptor =
                (PipelineBuildCreator.DescriptorImpl) Jenkins.getInstance().getDescriptor(PipelineBuildCreator.class);
        return descriptor.getScriptDir();
    }

    public BuildStepMonitor getRequiredMonitorService() {
        return BuildStepMonitor.NONE;
    }

    /**
     * Descriptor for {@link PipelineStageFinisher}. Used as a singleton.
     * The class is marked as public so that it can be accessed from views.
     *
     * <p>
     * See <tt>src/main/resources/hudson/plugins/hello_world/ProjectBuildResult/*.jelly</tt>
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
            return "Dashboard: Set pipeline stage status";
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

        public ListBoxModel doFillPipelineStageStatusItems() {
            ListBoxModel items = new ListBoxModel();
            items.add("Success", "passed");
            items.add("Failed", "failed");
            items.add("In progress", "in_progress");
            return items;
        }
    }
}


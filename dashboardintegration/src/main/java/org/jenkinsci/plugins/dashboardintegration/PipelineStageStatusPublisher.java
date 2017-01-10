package org.jenkinsci.plugins.dashboardintegration;

import java.io.IOException;

import jenkins.model.Jenkins;
import net.sf.json.JSONObject;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

import hudson.Extension;
import hudson.Launcher;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.model.BuildListener;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Publisher;
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
public class PipelineStageStatusPublisher extends Publisher {

    private final String pipelineBuildId;

    private final String pipelineStage;

    private final String pipelineStageStatus;

    private final boolean ignoreFailures;

    private final String bashInterpreter;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public PipelineStageStatusPublisher(String pipelineBuildId,
                                        String pipelineStage,
                                        String pipelineStageStatus,
                                        boolean ignoreFailures,
                                        String bashInterpreter) {
        this.pipelineBuildId = pipelineBuildId;
        this.pipelineStage = pipelineStage;
        this.pipelineStageStatus = pipelineStageStatus;
        this.ignoreFailures = ignoreFailures;
        this.bashInterpreter = bashInterpreter;
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

    public String getBashInterpreter() {
        return bashInterpreter;
    }

    @Override
    public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) throws IOException {
      String scriptDir = getScriptDir();
      if (scriptDir.equals("use_local")) {
        scriptDir = build.getWorkspace().toString() + "/scripts";
      }

        PipelineStageStatusSetter setter = new PipelineStageStatusSetter(build, launcher, listener);
        return setter.setStageStatus(getPipelineBuildId(), getPipelineStage(), getPipelineStageStatus(), scriptDir, isIgnoreFailures(), getBashInterpreter());
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
     * Descriptor for {@link PipelineStageStatusPublisher}. Used as a singleton.
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
            return "Dashboard: Set pipeline stage status";
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) throws FormException {
            save();
            return super.configure(req,formData);
        }

        private Integer getPipelineStages() throws IOException{
            PipelineBuildCreatorBuilder.DescriptorImpl descriptor =
                    (PipelineBuildCreatorBuilder.DescriptorImpl) Jenkins.getInstance().getDescriptor(PipelineBuildCreatorBuilder.class);
            return descriptor.getPipelineStages();
        }

        public ListBoxModel doFillPipelineStageItems() throws IOException {
            return PipelineStageStatusHelper.doFillPipelineStageItems(getPipelineStages());
        }

        public ListBoxModel doFillPipelineStageStatusItems() {
            return PipelineStageStatusHelper.doFillPipelineStageStatusItems();
        }
    }
}

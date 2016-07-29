package org.jenkinsci.plugins.dashboardintegration;

import java.io.IOException;

import hudson.tasks.Builder;
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
public class PipelineStageStatusBuilder extends Builder {

    private final String pipelineBuildId;

    private final String pipelineStage;

    private final String pipelineStageStatus;

    private final boolean ignoreFailures;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public PipelineStageStatusBuilder(String pipelineBuildId, String pipelineStage, String pipelineStageStatus,
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
    public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) throws IOException {
        String scriptDir = getScriptDir();
        if ( scriptDir == "use_local" ) {
          scriptDir = build.getWorkspace().readToString() + "/scripts";
        }

        PipelineStageStatusSetter setter = new PipelineStageStatusSetter(build, launcher, listener);
        return setter.setStageStatus(getPipelineBuildId(), getPipelineStage(), getPipelineStageStatus(), scriptDir, isIgnoreFailures());
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
     * Descriptor for {@link org.jenkinsci.plugins.dashboardintegration.PipelineStageStatusBuilder}. Used as a singleton.
     * The class is marked as public so that it can be accessed from views.
     *
     * <p>
     * See <tt>src/main/resources/hudson/plugins/hello_world/ProjectBuildResultPublisher/*.jelly</tt>
     * for the actual HTML fragment for the configuration screen.
     */
    @Extension
    public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {
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

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
import hudson.model.Result;
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
public class ProjectBuildResultBuilder extends Builder {

    private final String pipelineBuildId;

    private final String pipelineStage;

    private final boolean ignoreFailures;

    private final String buildName;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public ProjectBuildResultBuilder(String pipelineBuildId, String pipelineStage,
                                     boolean ignoreFailures, String buildName) {
        this.pipelineBuildId = pipelineBuildId;
        this.pipelineStage = pipelineStage;
        this.ignoreFailures = ignoreFailures;
        this.buildName = buildName;
    }

    public String getPipelineBuildId() {
        return pipelineBuildId;
    }

    public String getPipelineStage() {
        return pipelineStage;
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

            PipelineBuildResultSetter resultSetter = new PipelineBuildResultSetter(build, launcher, listener);

            boolean exitCode = resultSetter.recordBuildResults(getPipelineBuildId(), getPipelineStage(), getScriptDir(), buildName);

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

    private String getScriptDir() throws IOException{
        PipelineBuildCreatorBuilder.DescriptorImpl descriptor =
                (PipelineBuildCreatorBuilder.DescriptorImpl) Jenkins.getInstance().getDescriptor(PipelineBuildCreatorBuilder.class);
        return descriptor.getScriptDir();
    }

    /**
     * Descriptor for {@link org.jenkinsci.plugins.dashboardintegration.ProjectBuildResultBuilder}. Used as a singleton.
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
            return "Dashboard: Add project build to pipeline stage as in progress";
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) throws FormException {
            save();
            return super.configure(req,formData);
        }

        public ListBoxModel doFillPipelineStageItems() {
            return PipelineStageStatusHelper.doFillPipelineStageItems();
        }
    }
}


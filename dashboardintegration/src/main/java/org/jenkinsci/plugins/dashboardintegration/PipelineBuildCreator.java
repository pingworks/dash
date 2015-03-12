package org.jenkinsci.plugins.dashboardintegration;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;

import hudson.EnvVars;
import hudson.model.*;
import hudson.tasks.*;
import net.sf.json.JSONObject;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.StaplerRequest;

import hudson.Extension;
import hudson.Launcher;
import hudson.Proc;
import hudson.util.FormValidation;

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
public class PipelineBuildCreator extends Builder {

    private final String pipelineBuildId;

    private final String pipelineName;

    private final String pipelineBuildNr;

    private final String pipelineBuildBranch;

    private final String pipelineBuildCommitId;

    private final String srcDir;

    private final boolean ignoreFailures;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public PipelineBuildCreator(String pipelineBuildId, String pipelineName, String pipelineBuildNr,
                                String pipelineBuildBranch,
                                String pipelineBuildCommitId,
                                String srcDir, boolean ignoreFailures) {
        this.pipelineBuildId = pipelineBuildId;
        this.pipelineName = pipelineName;
        this.pipelineBuildNr = pipelineBuildNr;
        this.pipelineBuildBranch = pipelineBuildBranch;
        this.pipelineBuildCommitId = pipelineBuildCommitId;
        this.srcDir = srcDir;
        this.ignoreFailures = ignoreFailures;
    }

    public String getPipelineBuildId() {
        return pipelineBuildId;
    }

    public String getPipelineName() {
        return pipelineName;
    }

    public String getPipelineBuildNr() {
        return pipelineBuildNr;
    }

    public String getPipelineBuildBranch() {
        return pipelineBuildBranch;
    }

    public String getPipelineBuildCommitId() {
        return pipelineBuildCommitId;
    }

    public String getSrcDir() {
        return srcDir;
    }

    public boolean isIgnoreFailures() {
        return ignoreFailures;
    }

    @Override
    public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) {

        try {
            Result originalResult = build.getResult();
            boolean exitCode = startPipelineBuild(build, launcher, listener);

            List<ParameterValue> params = new ArrayList<ParameterValue>();
            EnvVars envVars = build.getEnvironment(listener);
            params.add(new StringParameterValue("PIPELINE_BUILD_ID", envVars.expand(getPipelineBuildId())));
            params.add(new StringParameterValue("PIPELINE_NAME", envVars.expand(getPipelineName())));
            params.add(new StringParameterValue("PIPELINE_BUILD_NR", envVars.expand(getPipelineBuildNr())));
            params.add(new StringParameterValue("PIPELINE_BUILD_BRANCH", envVars.expand(getPipelineBuildBranch())));
            params.add(new StringParameterValue("PIPELINE_BUILD_COMMIT_ID", envVars.expand(getPipelineBuildCommitId())));
            build.addAction(new ParametersAction(params));

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

    private boolean startPipelineBuild(AbstractBuild build, Launcher launcher, BuildListener listener) throws IOException, InterruptedException {
        String[] cmdStrings = new String[]{
                "/bin/bash",
                getDescriptor().getScriptDir() + "/repo/start_pipeline_build.sh",
                getPipelineBuildId(),
                getPipelineName(),
                getPipelineBuildNr(),
                getPipelineBuildBranch(),
                getPipelineBuildCommitId(),
                getSrcDir()
        };

        Launcher.ProcStarter ps = launcher.new ProcStarter();
        ps = ps.cmds(cmdStrings).stdout(listener);
        ps = ps.pwd(build.getWorkspace()).envs(build.getEnvironment(listener));

        Proc proc = launcher.launch(ps);
        return (proc.join() == 0);
    }

    // Overridden for better type safety.
    // If your plugin doesn't really define any property on Descriptor,
    // you don't have to do this.
    @Override
    public DescriptorImpl getDescriptor() {
        return (DescriptorImpl)super.getDescriptor();
    }

    /**
     * Descriptor for {@link PipelineBuildCreator}. Used as a singleton.
     * The class is marked as public so that it can be accessed from views.
     *
     * <p>
     * See <tt>src/main/resources/hudson/plugins/hello_world/ProjectBuildResult/*.jelly</tt>
     * for the actual HTML fragment for the configuration screen.
     */
    @Extension
    public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {
        /**
         * scriptDir
         */
        private String scriptDir;

        /**
         * In order to load the persisted global configuration, you have to 
         * call load() in the constructor.
         */
        public DescriptorImpl() {
            load();
        }

        public FormValidation doCheckPipelineBuildId(@QueryParameter String value)
                throws IOException, ServletException {
            if (value.length() == 0)
                return FormValidation.error("Please set a pipeline build id");
            return FormValidation.ok();
        }

        public FormValidation doCheckPipelineName(@QueryParameter String value)
                throws IOException, ServletException {
            if (value.length() == 0)
                return FormValidation.error("Please set a pipeline name");
            return FormValidation.ok();
        }

        public FormValidation doCheckPipelineBuildNr(@QueryParameter String value)
                throws IOException, ServletException {
            if (value.length() == 0)
                return FormValidation.error("Please set a pipeline build number");
            return FormValidation.ok();
        }

        public FormValidation doCheckPipelineBuildBranch(@QueryParameter String value)
                throws IOException, ServletException {
            if (value.length() == 0)
                return FormValidation.error("Please set a pipeline build branch");
            return FormValidation.ok();
        }

        public FormValidation doCheckPipelineBuildCommitId(@QueryParameter String value)
                throws IOException, ServletException {
            if (value.length() == 0)
                return FormValidation.error("Please set a pipeline build commit id");
            return FormValidation.ok();
        }

        public boolean isApplicable(Class<? extends AbstractProject> aClass) {
            // Indicates that this builder can be used with all kinds of project types 
            return true;
        }

        /**
         * This human readable name is used in the configuration screen.
         */
        public String getDisplayName() {
            return "Dashboard: Create a new pipeline build";
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) throws FormException {
            scriptDir = formData.getString("scriptDir");
            save();
            return super.configure(req,formData);
        }

        public String getScriptDir() throws IOException{
            if (scriptDir == null || scriptDir == "") {
                throw new IOException("Missing scriptdir from global configuration!");
            }
            return scriptDir;
        }

    }
}


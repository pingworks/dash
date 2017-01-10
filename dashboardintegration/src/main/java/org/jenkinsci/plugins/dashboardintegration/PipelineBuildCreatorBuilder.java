package org.jenkinsci.plugins.dashboardintegration;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;

import hudson.EnvVars;
import hudson.model.*;
import hudson.tasks.*;
import hudson.util.ListBoxModel;
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
public class PipelineBuildCreatorBuilder extends Builder {

    private final String pipelineBuildId;

    private final String pipelineName;

    private final String pipelineBuildNr;

    private final String pipelineBuildBranch;

    private final String pipelineBuildCommitId;

    private final String srcDir;

    private final String repoLink;

    private final boolean ignoreFailures;

    private final String bashInterpreter;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public PipelineBuildCreatorBuilder(String pipelineBuildId, String pipelineName, String pipelineBuildNr,
                                       String pipelineBuildBranch,
                                       String pipelineBuildCommitId,
                                       String srcDir,
                                       String repoLink,
                                       boolean ignoreFailures,
                                       String bashInterpreter) {
        this.pipelineBuildId = pipelineBuildId;
        this.pipelineName = pipelineName;
        this.pipelineBuildNr = pipelineBuildNr;
        this.pipelineBuildBranch = pipelineBuildBranch;
        this.pipelineBuildCommitId = pipelineBuildCommitId;
        this.srcDir = srcDir;
        this.repoLink = repoLink;
        this.ignoreFailures = ignoreFailures;
        this.bashInterpreter = bashInterpreter;
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

    public String getRepoLink() {
        return repoLink;
    }

    public boolean isIgnoreFailures() {
        return ignoreFailures;
    }

    public String getBashInterpreter() {
        return bashInterpreter;
    }

    public String getIconFileName() {
        return null;
    }

    public String getDisplayName() {
        return null;
    }

    public String getUrlName() {
        return null;
    }

    @Override
    public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) {

        try {
            Result originalResult = build.getResult();
            boolean exitCode = startPipelineBuild(build, launcher, listener);

            PipelineBuildCreatorEnvContributionAction envContributionAction = new PipelineBuildCreatorEnvContributionAction(this);
            build.addAction(envContributionAction);

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
      String scriptDir = getDescriptor().getScriptDir();
      if (scriptDir.equals("use_local")) {
        scriptDir = build.getWorkspace().toString() + "/scripts";
      }
      String[] cmdStrings = new String[]{
                getBashInterpreter(),
                scriptDir + "/repo/start_pipeline_build.sh",
                getPipelineBuildId(),
                getPipelineName(),
                getPipelineBuildNr(),
                getPipelineBuildBranch(),
                getPipelineBuildCommitId(),
                getSrcDir(),
                getRepoLink()
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
     * Descriptor for {@link PipelineBuildCreatorBuilder}. Used as a singleton.
     * The class is marked as public so that it can be accessed from views.
     *
     * <p>
     * See <tt>src/main/resources/hudson/plugins/hello_world/ProjectBuildResultPublisher/*.jelly</tt>
     * for the actual HTML fragment for the configuration screen.
     */
    @Extension
    public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {
        /**
         * scriptDir
         */
        private String scriptDir;

        private Integer pipelineStages;

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
            pipelineStages = formData.getInt("pipelineStages");
            save();
            return super.configure(req,formData);
        }

        public String getScriptDir() throws IOException{
            if (scriptDir == null || scriptDir == "") {
                throw new IOException("Missing scriptdir from global configuration!");
            }
            return scriptDir;
        }

        public Integer getPipelineStages() throws IOException {
            if (pipelineStages == null) {
                throw new IOException("Missing pipelineStages from global configuration!");
            }
            return pipelineStages;
        }

        public ListBoxModel doFillPipelineStagesItems() {
            ListBoxModel items = new ListBoxModel();
            items.add("one", "1");
            items.add("two", "2");
            items.add("three", "3");
            items.add("four", "4");
            items.add("five", "5");
            items.add("six", "6");
            items.add("seven", "7");
            items.add("eight", "8");
            items.add("nine", "9");
            items.add("ten", "10");
            return items;
        }
    }
}

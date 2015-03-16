package org.jenkinsci.plugins.dashboardintegration;

import hudson.EnvVars;
import hudson.model.AbstractBuild;
import hudson.model.EnvironmentContributingAction;

/**
 */
public class PipelineBuildCreatorEnvContributionAction implements EnvironmentContributingAction {

    private final PipelineBuildCreatorBuilder builder;

    public PipelineBuildCreatorEnvContributionAction(PipelineBuildCreatorBuilder builder) {
        this.builder = builder;
    }

    public void buildEnvVars(AbstractBuild<?, ?> build, EnvVars envVars) {
        if (envVars == null)
            return;

        envVars.put("PIPELINE_BUILD_ID", envVars.expand(builder.getPipelineBuildId()));
        envVars.put("PIPELINE_NAME", envVars.expand(builder.getPipelineName()));
        envVars.put("PIPELINE_BUILD_NR", envVars.expand(builder.getPipelineBuildNr()));
        envVars.put("PIPELINE_BUILD_BRANCH", envVars.expand(builder.getPipelineBuildBranch()));
        envVars.put("PIPELINE_BUILD_COMMIT_ID", envVars.expand(builder.getPipelineBuildCommitId()));
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
}

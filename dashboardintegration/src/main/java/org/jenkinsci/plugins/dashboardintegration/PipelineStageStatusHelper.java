package org.jenkinsci.plugins.dashboardintegration;

import hudson.model.AbstractProject;
import hudson.model.Describable;
import hudson.model.Descriptor;
import hudson.tasks.BuildStep;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.Publisher;
import hudson.util.ListBoxModel;
import net.sf.json.JSONObject;
import org.kohsuke.stapler.StaplerRequest;

/**
 */
public final class PipelineStageStatusHelper {

    private PipelineStageStatusHelper() {

    }

    public static ListBoxModel doFillPipelineStageItems() {
        ListBoxModel items = new ListBoxModel();
        items.add("First Stage", "first");
        items.add("Second Stage", "second");
        items.add("Third Stage", "third");
        return items;
    }

    public static ListBoxModel doFillPipelineStageStatusItems() {
        ListBoxModel items = new ListBoxModel();
        items.add("Success", "passed");
        items.add("Failed", "failed");
        items.add("In progress", "in_progress");
        items.add("Result from this build", "this_build");
        return items;
    }
}

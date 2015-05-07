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

    public static ListBoxModel doFillPipelineStageItems(Integer pipelineStages) {
        ListBoxModel items = new ListBoxModel();
        items.add("First Stage", "first");
        if (pipelineStages >= 2)
            items.add("Second Stage", "second");
        if (pipelineStages >= 3)
            items.add("Third Stage", "third");
        if (pipelineStages >= 4)
            items.add("Fourth Stage", "fourth");
        if (pipelineStages >= 5)
            items.add("Fifth Stage", "fiveth");
        if (pipelineStages >= 6)
            items.add("Sixth Stage", "sixth");
        if (pipelineStages >= 7)
            items.add("Seventh Stage", "seventh");
        if (pipelineStages >= 8)
            items.add("Eighth Stage", "aighth");
        if (pipelineStages >= 9)
            items.add("Ninth Stage", "ninth");
        if (pipelineStages >= 10)
            items.add("Tenth Stage", "tenth");
        return items;
    }

    public static ListBoxModel doFillPipelineStageStatusItems() {
        ListBoxModel items = new ListBoxModel();
        items.add("Success", "passed");
        items.add("Failed", "failed");
        items.add("In progress", "in_progress");
        return items;
    }
}

import CustomError from "#app/utils/CustomError.js";
import subscriptionsService from "#app/services/subscriptionsService.js";

const FREE_TIER_LIMITS = {
  max_properties: 1,
  max_hotels: 0,
  max_images: 3,
  max_videos: 0,
  can_feature_properties: false,
};

type LimitFeature = "max_properties" | "max_hotels" | "max_images" | "max_videos";

async function getEffectivePlan(userId: string) {
  const plan = await subscriptionsService.getActivePlanForUser(userId);
  return plan ?? FREE_TIER_LIMITS;
}

async function assertWithinLimit(userId: string, feature: LimitFeature, currentCount: number) {
  const plan = await getEffectivePlan(userId);
  const limit = plan[feature];

  if (currentCount >= limit) {
    throw new CustomError(
      `You've reached your plan's limit for ${feature.replace("max_", "")} (${limit}). Upgrade your subscription to add more.`,
      403,
    );
  }
}

async function canFeatureProperties(userId: string): Promise<boolean> {
  const plan = await getEffectivePlan(userId);
  return Boolean(plan.can_feature_properties);
}

export default { getEffectivePlan, assertWithinLimit, canFeatureProperties };

import type {
  TMDBReleaseDatesResponse,
  TMDBReleaseDateResult,
  TMDBWatchProvidersResponse,
  TMDBReleaseDate,
} from "$lib/types/tmdb";

interface ReleaseInfo {
  releaseType: string;
  certifications: Record<string, string>;
}

interface ReleaseTypeParams {
  isInTheaters: boolean;
  isStreamingAvailable: boolean;
  isDigitalRelease: boolean;
  hasFutureRelease: boolean;
  isRentalOrPurchaseAvailable: boolean;
}

const cache = new Map<string, ReleaseInfo>();

export async function getReleaseType(
  mediaId: number,
  mediaType: string,
  region = "US",
): Promise<ReleaseInfo> {
  try {
    const cacheKey = `${mediaId}_${mediaType}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const apiKey = process.env.TMDB_API_KEY;
    const apiUrl = process.env.TMDB_API_URL;


    const [releaseDatesResponse, watchProvidersResponse] = await Promise.all([
      fetch(
        `${apiUrl}/${mediaType}/${mediaId}/release_dates?api_key=${apiKey}`,
      ),
      fetch(
        `${apiUrl}/${mediaType}/${mediaId}/watch/providers?api_key=${apiKey}`,
      ),
    ]);

    if (!releaseDatesResponse.ok)
      throw new Error("Failed to fetch release dates.");
    if (!watchProvidersResponse.ok)
      throw new Error("Failed to fetch watch providers.");

    const releaseDatesData: TMDBReleaseDatesResponse =
      await releaseDatesResponse.json();
    const watchProvidersData: TMDBWatchProvidersResponse =
      await watchProvidersResponse.json();

    const currentUtcDate = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
      ),
    );

    const releases = releaseDatesData.results.flatMap(
      (result) => result.release_dates,
    );
    const certifications = extractCertifications(releaseDatesData, region);

    const isDigitalRelease = checkDigitalRelease(releases, currentUtcDate);
    const isInTheaters = checkTheaterRelease(releases, currentUtcDate);
    const hasFutureRelease = checkFutureRelease(releases, currentUtcDate);
    const isStreamingAvailable = checkStreamingAvailability(watchProvidersData);
    const isRentalOrPurchaseAvailable =
      checkRentalOrPurchaseAvailability(watchProvidersData);

    const releaseType = determineReleaseType({
      isInTheaters,
      isStreamingAvailable,
      isDigitalRelease,
      hasFutureRelease,
      isRentalOrPurchaseAvailable,
    });

    const result = { releaseType, certifications };
    cache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Error fetching release type and certifications:", error);
    return {
      releaseType: "Unknown Quality",
      certifications: {},
    };
  }
}

function extractCertifications(
  releaseDatesData: TMDBReleaseDatesResponse,
  region: string,
): Record<string, string> {
  const certifications: Record<string, string> = {};

  releaseDatesData.results.forEach((result: TMDBReleaseDateResult) => {
    const certificationEntry = result.release_dates.find(
      (release) => release.certification,
    );
    if (certificationEntry) {
      certifications[result.iso_3166_1] = certificationEntry.certification;
    }
  });

  return certifications;
}

function checkDigitalRelease(
  releases: TMDBReleaseDate[],
  currentUtcDate: Date,
): boolean {
  return releases.some(
    (release) =>
      [4, 6].includes(release.type) &&
      new Date(release.release_date).getTime() <= currentUtcDate.getTime(),
  );
}

function checkTheaterRelease(
  releases: TMDBReleaseDate[],
  currentUtcDate: Date,
): boolean {
  return releases.some((release) => {
    const releaseDate = new Date(release.release_date);
    return (
      release.type === 3 && releaseDate.getTime() <= currentUtcDate.getTime()
    );
  });
}

function checkFutureRelease(
  releases: TMDBReleaseDate[],
  currentUtcDate: Date,
): boolean {
  return releases.some(
    (release) =>
      new Date(release.release_date).getTime() > currentUtcDate.getTime(),
  );
}

function checkStreamingAvailability(
  watchProvidersData: TMDBWatchProvidersResponse,
): boolean {
  const availableRegions = Object.keys(watchProvidersData.results || {});
  return availableRegions.some(
    (region) =>
      (watchProvidersData.results?.[region]?.flatrate || []).length > 0,
  );
}

function checkRentalOrPurchaseAvailability(
  watchProvidersData: TMDBWatchProvidersResponse,
): boolean {
  const availableRegions = Object.keys(watchProvidersData.results || {});
  return availableRegions.some((region) => {
    const rentProviders = watchProvidersData.results?.[region]?.rent || [];
    const buyProviders = watchProvidersData.results?.[region]?.buy || [];
    return rentProviders.length > 0 || buyProviders.length > 0;
  });
}

function determineReleaseType(params: ReleaseTypeParams): string {
  const {
    isInTheaters,
    isStreamingAvailable,
    isDigitalRelease,
    hasFutureRelease,
    isRentalOrPurchaseAvailable,
  } = params;

  if (isInTheaters && !isStreamingAvailable && !isDigitalRelease) {
    return "Cam";
  } else if (isStreamingAvailable || isDigitalRelease) {
    return "HD";
  } else if (hasFutureRelease && !isInTheaters) {
    return "Not Released Yet";
  } else if (isRentalOrPurchaseAvailable) {
    return "Rental/Buy Available";
  } else {
    return "Unknown Quality";
  }
}

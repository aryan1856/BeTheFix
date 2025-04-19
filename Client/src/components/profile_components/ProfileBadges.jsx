import React from "react";
import Confetti from "react-confetti";

const ProfileBadges = ({ user }) => {
  const {
    badges,
    issuesResolved,
    megaBadge,
    volunteerBadge,
    volunteerResolvedCount = 0
  } = user;

  const resolvedSinceLastBadge = issuesResolved % 5;
  const progressPercent = (resolvedSinceLastBadge / 5) * 100;
  const showConfetti = issuesResolved > 0 && issuesResolved % 5 === 0;

  return (
    <div className="bg-gray-100 p-4 flex justify-center items-start">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md space-y-5">
        <h2 className="text-xl font-bold text-center text-gray-800">🏅 Badge Progress</h2>

        {/* Regular Badge */}
        <div className="flex items-center gap-3">
          <img src="/icons/badge.svg" alt="Regular Badge" className="w-8 h-8" />
          <div>
            <p className="font-semibold text-gray-800">{badges} Badge{badges !== 1 ? "s" : ""}</p>
            <p className="text-sm text-gray-500">For every 5 resolved issues</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <p className="text-sm text-gray-600 mb-1">
            {5 - resolvedSinceLastBadge} more to next badge
          </p>
          <div className="w-full h-2 bg-gray-300 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Mega Badge */}
        {megaBadge && (
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <img src="/icons/megabadge.svg" alt="Mega Badge" className="w-8 h-8" />
            <div>
              <p className="font-semibold text-yellow-800">Mega Badge</p>
              <p className="text-xs text-yellow-700">After 5 regular badges</p>
            </div>
          </div>
        )}

        {/* Volunteer Badge */}
        {volunteerBadge && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <img src="/icons/volunteer.svg" alt="Volunteer Badge" className="w-8 h-8" />
            <div>
              <p className="font-semibold text-blue-800">Volunteer Badge</p>
              <p className="text-xs text-blue-700">{volunteerResolvedCount} issues resolved as a volunteer</p>
            </div>
          </div>
        )}

        {showConfetti && <Confetti />}
      </div>
    </div>
  );
};

export default ProfileBadges;

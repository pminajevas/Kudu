import Dialog from "../ui/Dialog";
import Button from "../ui/Button";

interface JoinGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: () => void;
}

export default function JoinGroupDialog({ isOpen, onClose, onCreateGroup }: JoinGroupDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Join a Group">
      <div className="space-y-6">
        {/* Add emoji to the first section instead */}
        <div className="text-center space-y-4">
          <div className="text-6xl">🎭</div>
          <div className="space-y-3">
            <p className="text-gray-700 text-lg font-medium">Plot twist! You can't just crash the party! 🎉</p>
            <p className="text-gray-600">
              To join a group, you'll need an <span className="font-semibold text-orange-600">invite link</span> from someone who's already in the group. Think of it as your golden ticket! 🎫
            </p>
          </div>
        </div>

        {/* Scenario section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <span>🤷‍♂️</span>
            None of your friends use this app yet?
          </h4>
          <p className="text-gray-600 text-sm">
            No worries! You could be the trendsetter and create your own group. Then you can invite your friends and be the cool one who introduced them to something awesome! 😎
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={onCreateGroup} className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create My Own Group
            </span>
          </Button>

          <Button onClick={onClose} variant="secondary" className="flex-1">
            I'll Wait for an Invite
          </Button>
        </div>

        {/* Fun tip */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">💡 Pro tip: Groups are more fun with friends anyway!</p>
        </div>
      </div>
    </Dialog>
  );
}

import { Github, Linkedin, Mail } from "lucide-react"

export default function TeamFooter() {
  const teamMembers = [
    { name: "Aman Kumar", role: "Lead Developer", github: "#", linkedin: "#", email: "#" },
    { name: "Vijendra Rajput", role: "Backend Developer", github: "#", linkedin: "#", email: "#" },
    { name: "Aman Dwivedi", role: "Frontend Developer", github: "#", linkedin: "#", email: "#" },
    { name: "Diksha Jain", role: "UI/UX Designer", github: "#", linkedin: "#", email: "#" },
    { name: "Priyanshi Bhatiya", role: "Data Analyst", github: "#", linkedin: "#", email: "#" },
    { name: "Anushka Singh", role: "Product Manager", github: "#", linkedin: "#", email: "#" },
  ]

  return (
    <footer className="team-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Meet Our Team</h2>
          <p className="text-slate-300">The brilliant minds behind GUARD Smart Tourist Safety</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member bg-slate-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-slate-300 mb-4">{member.role}</p>
              <div className="flex justify-center space-x-3">
                <a href={member.github} className="text-slate-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href={member.linkedin} className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={member.email} className="text-slate-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-600 pt-8 text-center">
          <p className="text-slate-300">© 2024 GUARD Smart Tourist Safety. Built with ❤️ for safer travels.</p>
        </div>
      </div>
    </footer>
  )
}

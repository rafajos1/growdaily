export const resend = {
  emails: {
    send: async (payload: any) => {
      console.log("Pretend to send email with:", payload)
      return { success: true }
    }
  }
}